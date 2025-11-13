import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

export type CalendarProps = {
  mode?: "single" | "multiple";
  selected?: Date | Date[];
  onSelect?: (date: Date | Date[] | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
};

function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(year, month, day);
    
    if (disabled && disabled(selectedDate)) {
      return;
    }

    if (mode === "single") {
      onSelect?.(selectedDate);
    } else {
      // Multiple mode logic
      const currentSelected = Array.isArray(selected) ? selected : [];
      const dateExists = currentSelected.some(
        d => d.toDateString() === selectedDate.toDateString()
      );
      
      if (dateExists) {
        onSelect?.(currentSelected.filter(d => d.toDateString() !== selectedDate.toDateString()));
      } else {
        onSelect?.([...currentSelected, selectedDate]);
      }
    }
  };

  const isSelected = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    
    if (mode === "single" && selected instanceof Date) {
      return selected.toDateString() === dateToCheck.toDateString();
    }
    
    if (Array.isArray(selected)) {
      return selected.some(d => d.toDateString() === dateToCheck.toDateString());
    }
    
    return false;
  };

  const isDisabled = (day: number) => {
    if (!disabled) return false;
    return disabled(new Date(year, month, day));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <ChevronLeft size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <ChevronRight size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View style={styles.dayNamesRow}>
        {dayNames.map(name => (
          <View key={name} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{name}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.dayCell} />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const selected = isSelected(day);
          const disabledDay = isDisabled(day);

          return (
            <TouchableOpacity
              key={day}
              onPress={() => handleDateSelect(day)}
              disabled={disabledDay}
              style={[
                styles.dayCell,
                selected && styles.selectedDay,
                disabledDay && styles.disabledDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selected && styles.selectedDayText,
                  disabledDay && styles.disabledDayText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "600",
  },
  dayNamesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayNameCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%", // 100% / 7 days
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  dayText: {
    fontSize: 14,
    color: "#000",
  },
  selectedDay: {
    backgroundColor: "#030213",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: "#999",
  },
});

Calendar.displayName = "Calendar";

export { Calendar };
