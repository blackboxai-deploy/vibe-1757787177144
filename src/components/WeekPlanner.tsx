"use client";

import { DayOfWeek, DAYS_OF_WEEK } from '@/lib/types';
import { useTodos } from '@/hooks/use-todos';
import TodoList from './TodoList';

export default function WeekPlanner() {
  const todos = useTodos();

  if (todos.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Week Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">This Week</h2>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })} - {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Vertical Day Cards */}
      {DAYS_OF_WEEK.map((day, index) => {
        const totalTodos = todos.getTotalTodosForDay(day.key);
        const completedTodos = todos.getCompletedTodosForDay(day.key);
        const isToday = day.key === getCurrentDay();
        const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

        return (
          <div
            key={day.key}
            className={`
              group border border-gray-100 rounded-lg bg-white transition-all duration-200
              ${isToday ? 'border-black shadow-sm' : 'hover:border-gray-200 hover:shadow-sm'}
            `}
          >
            {/* Day Header */}
            <div className="px-6 py-4 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-lg font-medium ${isToday ? 'text-black' : 'text-gray-700'}`}>
                      {day.label}
                    </h3>
                    {isToday && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  
                  {totalTodos > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{completedTodos} of {totalTodos}</span>
                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-400">
                  {getDateForDay(day.key).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            {/* Day Content */}
            <div className="px-6 py-4">
              <TodoList day={day.key} todos={todos} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getCurrentDay(): DayOfWeek {
  const dayIndex = new Date().getDay();
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return daysMap[dayIndex] as DayOfWeek;
}

function getDateForDay(day: DayOfWeek): Date {
  const today = new Date();
  const todayIndex = today.getDay();
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetIndex = daysMap.indexOf(day);
  const diffDays = targetIndex - todayIndex;
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diffDays);
  return targetDate;
}