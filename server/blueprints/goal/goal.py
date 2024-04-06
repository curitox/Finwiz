from flask import Blueprint, request, jsonify
from datetime import datetime
from model import User,Goal,Savings,db
from middleware.verifyToken import verifyToken
from error import create_error

goal_bp=Blueprint("goal", __name__, template_folder="goal")

@goal_bp.route('/goal/add', methods=['POST'])
@verifyToken
def addGoal():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")

    goal_input=request.json
    if(goal_input['target_amount']==0):
        return create_error(500, "Target amount can not be 0 for a goal.")
    
    try:
        # Create a new goal object
        new_goal = Goal(
            name=goal_input['name'],
            description=goal_input['description'],
            target_amount=goal_input['target_amount'],
            target_date=goal_input['target_date'],
            priority_level=goal_input['priority_level'],
            status="IN_PROGRESS",
            user_id=user_id
        )
        
        # Add the goal to the user's goals
        user.goal.append(new_goal)

        # Commit changes to the database
        db.session.add(new_goal)
        db.session.commit()

        return jsonify({
                    'message': 'Goal added successfully',
                    'goal': {
                        'id': new_goal.id,
                        'targetDate': new_goal.target_date.isoformat(),
                        'name': new_goal.name,
                        'description': new_goal.description,
                        'target_amount': new_goal.target_amount,
                        'priority_level,': new_goal.priority_level,
                        'status': new_goal.status
                    }
                }), 200
    except KeyError as e:
        return create_error(400, f'Missing required field: {str(e)}')

    except Exception as e:
        db.session.rollback()
        return create_error(500, str(e))
    
@goal_bp.route('/goal/get', methods=['GET'])
@verifyToken
def goalGet():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    
    status_filter = request.args.get('status')
    
    if status_filter == 'ALL':
        goals = Goal.query.filter_by(user_id=user_id).all()
    elif status_filter == 'COMPLETE':
        goals = Goal.query.filter_by(user_id=user_id, status='COMPLETE').all()
    else:
        goals = Goal.query.filter_by(user_id=user_id).all()

    # Sort goals by target date in descending order
    goals.sort(key=lambda x: x.target_date, reverse=True)

    goals_data = [{
        'id': goal.id,
        'name': goal.name,
        'description': goal.description,
        'target_amount': str(goal.target_amount),
        'achieved_amount': str(goal.achieved_amount),
        'target_date': goal.target_date.strftime('%Y-%m-%d'),
        'priority_level': goal.priority_level,
        'status': goal.status,
        'progress': goal.achieved_amount / goal.target_amount if goal.target_amount != 0 else 0,
    } for goal in goals]

    return jsonify(goals_data), 200

@goal_bp.route('/goal/savings', methods=['GET'])
@verifyToken
def goalGetSavings():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    
    goal_id = request.args.get('id')
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return create_error(404, "Goal not found")
    if goal.user_id != user_id:
        return create_error(403, "You do not have permission to access this goal")

    # Fetch savings related to the goal
    savings = Savings.query.filter_by(goal_id=goal_id).all()

    # Construct response data
    savings_data = []
    for saving in savings:
        saving_data = {
            'id': saving.id,
            'week': saving.week,
            'amount': str(saving.amount),
            'date': saving.date.strftime('%Y-%m-%d'),
            'description': saving.description,
            'category': saving.category
        }
        savings_data.append(saving_data)

    return jsonify(savings_data), 200


@goal_bp.route('/goal/update', methods=['PATCH'])
@verifyToken
def goalUpdate():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    
    goal_id = request.args.get('id')
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return create_error(404, "Goal not found")
    if goal.user_id != user_id:
        return create_error(403, "You do not have permission to update this goal")

    try:
        goal_data = request.json
        for key, value in goal_data.items():
            setattr(goal, key, value)

        db.session.commit()

        return jsonify({
            'message': 'Goal updated successfully',
            'goal': {
                'id': goal.id,
                'target_date': goal.target_date.isoformat(),
                'name': goal.name,
                'description': goal.description,
                'target_amount': goal.target_amount,
                'priority_level,': goal.priority_level,
                'status': goal.status
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return create_error(500, str(e))

@goal_bp.route('/goal/progress', methods=['POST'])
@verifyToken
def goalProgress():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    goal_id = request.args.get('id')
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return create_error(404, "Goal not found")
    date_obj = datetime.fromisoformat(goal.createdOn.isoformat())
    current_date = datetime.now()
    weeks_passed = (current_date - date_obj).days // 7
    savings_data = request.json;
    amount = savings_data.get('amount')
    date = savings_data.get('date')
    if not date:
       date=datetime.today().strftime('%Y-%m-%d')
    savings_entry = Savings(week=weeks_passed, amount=amount, goal_id=goal.id, description=savings_data.get('description'), date=date)
    goal.achieved_amount = float(goal.achieved_amount)+float(amount)
    goal.savings.append(savings_entry)
    db.session.add(savings_entry)
    db.session.commit()
    if goal.achieved_amount >= goal.target_amount:
        goal.status = 'COMPLETE'
        db.session.commit()
    return jsonify({
                "amount": savings_entry.amount,
                "category": savings_entry.category,
                "date": savings_entry.date.isoformat(),
                "description": savings_entry.description,
                "id": savings_entry.id,
                "week": savings_entry.week,
                "category": savings_entry.category
            }), 201
    
@goal_bp.route('/goal/delete', methods=['DELETE'])
@verifyToken
def deleteGoal():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    goal_id = request.args.get('id')
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return create_error(404, "Goal not found")

    if goal.user_id != user_id:
        return create_error(403, "You do not have permission to delete this goal")

    try:
        print(user.goal)
        db.session.delete(goal)
        user.goal.remove(goal)

        db.session.commit()

        return jsonify({'message': 'Goal deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return create_error(500, str(e))
    
@goal_bp.route('/goal/savings/delete', methods=['DELETE'])
@verifyToken
def deleteSavings():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")

    goal_id = request.args.get('gid')
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return create_error(404, "Goal not found")
    if goal.user_id != user_id:
        return create_error(403, "You do not have permission to delete this goal")

    savings_id = request.args.get('sid')
    savings = Savings.query.filter_by(id=savings_id, goal_id=goal_id).first()
    if not savings:
        return create_error(404, "Savings not found")

    try:
        # Delete the savings entry
        goal.savings.remove(savings)
        db.session.delete(savings)
        db.session.commit()

        return jsonify({"message": "Savings deleted successfully."}), 200
    except Exception as e:
        # Rollback changes if any error occurs
        db.session.rollback()
        return create_error(500, "An error occurred while deleting savings: " + str(e))