import React from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card } from "react-native-paper";
import { ChartData } from "../types";

interface ReadingChartProps {
  title: string;
  data: ChartData;
  color: string;
  unit: string;
  emptyMessage?: string;
}

const ReadingChart: React.FC<ReadingChartProps> = ({
  title,
  data,
  color,
  unit,
  emptyMessage = "No data available",
}) => {
  const hasData = data.datasets[0].data.length > 0;
  const chartWidth = Dimensions.get("window").width - 60;

  return (
    <Card style={styles.chartCard}>
      <Card.Title title={title} />
      <Card.Content style={styles.cardContent}>
        {hasData ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.chartContainer}>
              <LineChart
                data={data}
                width={chartWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(${color}, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: color,
                  },
                  propsForLabels: {
                    fontSize: 10,
                    rotation: -45,
                    fontWeight: "bold",
                  },
                  style: {
                    borderRadius: 16,
                  },
                  formatYLabel: (value) => `${value}${unit}`,
                }}
                bezier
                style={styles.chart}
                fromZero={true}
                segments={5}
                withInnerLines={true}
                withOuterLines={true}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                withDots={data.datasets[0].data.length < 20}
                yAxisInterval={1}
                xLabelsOffset={15}
                verticalLabelRotation={-45}
                horizontalLabelRotation={-45}
              />
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>{emptyMessage}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardContent: {
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  chartContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    color: "#999",
  },
});

export default ReadingChart;
