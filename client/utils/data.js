import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const TransactionCategories = [
  {
    name: "Food",
    color: "#FF6F61",
    value: "food",
    icon: (
      <MaterialCommunityIcons name="food-turkey" size={24} color="#FF6F61" />
    ),
  },
  {
    name: "Shopping",
    color: "#FFD166",
    value: "shopping",
    icon: <MaterialCommunityIcons name="shopping" size={24} color="#FFD166" />,
  },
  {
    name: "Transportation",
    color: "#4CAF50",
    value: "transportation",
    icon: <MaterialCommunityIcons name="train-car" size={24} color="#4CAF50" />,
  },
  {
    name: "Housing",
    color: "#5DADE2",
    value: "housing",
    icon: (
      <MaterialCommunityIcons name="home-analytics" size={24} color="#5DADE2" />
    ),
  },
  {
    name: "Utilities",
    color: "#FFA07A",
    value: "utilities",
    icon: <MaterialCommunityIcons name="tools" size={24} color="#FFA07A" />,
  },
  {
    name: "Health & Fitness",
    color: "#AF7AC5",
    value: "health_fitness",
    icon: (
      <MaterialCommunityIcons name="heart-pulse" size={24} color="#AF7AC5" />
    ),
  },
  {
    name: "Personal Care",
    color: "#AED6F1",
    value: "personal_care",
    icon: (
      <MaterialCommunityIcons
        name="face-woman-shimmer"
        size={24}
        color="#AED6F1"
      />
    ),
  },
  {
    name: "Entertainment",
    color: "#F5B041",
    value: "entertainment",
    icon: (
      <MaterialCommunityIcons
        name="gamepad-variant"
        size={24}
        color="#F5B041"
      />
    ),
  },
  {
    name: "Education",
    color: "#76D7C4",
    value: "education",
    icon: <MaterialCommunityIcons name="school" size={24} color="#76D7C4" />,
  },
  {
    name: "Travel",
    color: "#FAD7A0",
    value: "travel",
    icon: <MaterialCommunityIcons name="airplane" size={24} color="#FAD7A0" />,
  },
  {
    name: "Savings & Investments",
    color: "#F1948A",
    value: "savings_investments",
    icon: (
      <MaterialCommunityIcons name="piggy-bank" size={24} color="#F1948A" />
    ),
  },
  {
    name: "Debt Payments",
    color: "#85C1E9",
    value: "debt_payments",
    icon: (
      <MaterialCommunityIcons
        name="credit-card-clock"
        size={24}
        color="#85C1E9"
      />
    ),
  },
  {
    name: "Gifts & Donations",
    color: "#D7BDE2",
    value: "gifts_donations",
    icon: <MaterialCommunityIcons name="gift" size={24} color="#D7BDE2" />,
  },
  {
    name: "Miscellaneous",
    color: "#E59866",
    value: "miscellaneous",
    icon: (
      <MaterialCommunityIcons name="atom-variant" size={24} color="#E59866" />
    ),
  },
  {
    name: "Unknown",
    color: "#CCCCCC",
    value: "Unknown",
    icon: <MaterialCommunityIcons name="question" size={24} color="#E59866" />,
  },
];

export const getCategoryByValue = (value) => {
  return TransactionCategories.find((category) => category.value === value);
};

export const onboardingDetails = [
  {
    image: "https://cdn.dribbble.com/users/2514124/screenshots/5474610/crypto6_3.gif",
    title: "Track your transactions effortlessly",
    description: "Keep a detailed record of all your financial transactions. Stay organized and manage your expenses with ease."
  },
  {
    image: "https://cdn.dribbble.com/users/25514/screenshots/4276494/vyta_brand_llustration_goals_tracking.gif",
    title: "Set Goals, Track Your Progress",
    description: "Define your objectives and monitor your achievements. Stay focused and motivated on your path to success.",
  },
  {
    image: "https://cdn.dribbble.com/users/1655164/screenshots/4818499/ss.gif",
    title: "Predict Profitable Investments, Estimate Expenses",
    description: "Identify the best investment opportunities and anticipate future costs. Make informed financial decisions with confidence.",
  }
]
