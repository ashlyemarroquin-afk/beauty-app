import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewProps, TextProps } from "react-native";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({
  value: "",
  onValueChange: () => {},
});

interface TabsProps extends ViewProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const Tabs = ({ value, onValueChange, children, style, ...props }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View style={[styles.tabs, style]} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  );
};

interface TabsListProps extends ViewProps {
  className?: string;
}

const TabsList = ({ children, style, ...props }: TabsListProps) => {
  return (
    <View style={[styles.tabsList, style]} {...props}>
      {children}
    </View>
  );
};

interface TabsTriggerProps extends Omit<TouchableOpacity["props"], "children"> {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsTrigger = ({ value: triggerValue, children, style, ...props }: TabsTriggerProps) => {
  const { value, onValueChange } = React.useContext(TabsContext);
  const isActive = value === triggerValue;

  return (
    <TouchableOpacity
      style={[styles.tabsTrigger, isActive && styles.tabsTriggerActive, style]}
      onPress={() => onValueChange(triggerValue)}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={[styles.tabsTriggerText, isActive && styles.tabsTriggerTextActive]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

interface TabsContentProps extends ViewProps {
  value: string;
  className?: string;
}

const TabsContent = ({ value: contentValue, children, style, ...props }: TabsContentProps) => {
  const { value } = React.useContext(TabsContext);

  if (value !== contentValue) {
    return null;
  }

  return (
    <View style={[styles.tabsContent, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    width: "100%",
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsTriggerActive: {
    backgroundColor: "#fff",
  },
  tabsTriggerText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tabsTriggerTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  tabsContent: {
    marginTop: 16,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
