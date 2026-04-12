import MealSection from './MealSection';

/**
 * FoodLogList Component
 * 
 * Organizes and displays all food logs by meal type
 * 
 * Props:
 * - foodLogs: Array of all food logs
 * - mealSummary: Object with nutrition summaries per meal
 * - onDeleteLog: Function to delete a log
 * - onEditLog: Function to edit a log
 * - onAddFood: Function to add food to a meal
 */
function FoodLogList({ foodLogs = [], mealSummary = {}, onDeleteLog, onEditLog, onAddFood }) {
  const organizeByMeal = () => {
    const organized = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    foodLogs.forEach((log) => {
      const mealType = log.meal_type?.toLowerCase() || 'snack';
      if (organized[mealType]) {
        organized[mealType].push(log);
      }
    });

    return organized;
  };

  const mealLogs = organizeByMeal();

  return (
    <div className="space-y-4">
      <MealSection
        mealType="breakfast"
        foodLogs={mealLogs.breakfast}
        summary={mealSummary.breakfast}
        onDelete={onDeleteLog}
        onEdit={onEditLog}
        onAddFood={onAddFood}
      />
      
      <MealSection
        mealType="lunch"
        foodLogs={mealLogs.lunch}
        summary={mealSummary.lunch}
        onDelete={onDeleteLog}
        onEdit={onEditLog}
        onAddFood={onAddFood}
      />
      
      <MealSection
        mealType="dinner"
        foodLogs={mealLogs.dinner}
        summary={mealSummary.dinner}
        onDelete={onDeleteLog}
        onEdit={onEditLog}
        onAddFood={onAddFood}
      />
      
      <MealSection
        mealType="snack"
        foodLogs={mealLogs.snack}
        summary={mealSummary.snack}
        onDelete={onDeleteLog}
        onEdit={onEditLog}
        onAddFood={onAddFood}
      />
    </div>
  );
}

export default FoodLogList;
