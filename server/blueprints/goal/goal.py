from flask import Blueprint, request, jsonify
from model import User,Goal,db
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
    try:
        # Create a new goal object
        new_goal = Goal(
            name=goal_input['name'],
            description=goal_input['description'],
            target_amount=goal_input['target_amount'],
            target_date=goal_input['target_date'],
            priority_level=goal_input['priority_level'],
            status=goal_input['status'],
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
    
@goal_bp.route('/goal/get', methods=['POST'])
@verifyToken
def goalGet():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    status_filter =  request.args.get('status')
    print(status_filter)
    if status_filter == 'ALL':
        goals = Goal.query.filter_by(user_id=user_id).all()
    elif status_filter == 'COMPLETE':
        goals = Goal.query.filter_by(user_id=user_id, status='COMPLETE').all()
    else:
        goals = Goal.query.filter_by(user_id=user_id, status='IN_PROGRESS').all()

    goals_data = [{
        'id': goal.id,
        'name': goal.name,
        'description': goal.description,
        'target_amount': str(goal.target_amount),
        'target_date': goal.target_date.strftime('%Y-%m-%d'),
        'priority_level': goal.priority_level,
        'status': goal.status
    } for goal in goals]

    return jsonify(goals_data), 200

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