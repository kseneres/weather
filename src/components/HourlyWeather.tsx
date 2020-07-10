import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, ButtonGroup} from 'react-native-elements';
import {HourlyWeatherData} from '../types';
import getWeatherDescription from '../helpers/getWeatherDescription';
import getTimeString from '../helpers/getTimeString';

enum DataChoice {
  TEMPERATURE,
  FEELS_LIKE,
  WIND_SPEED,
}

export interface HourlyWeatherProps {
  data: HourlyWeatherData[];
}

/**
 * Component that shows hourly weather data in a graph like form.
 */
export const HourlyWeather: React.FC<HourlyWeatherProps> = ({
  data: hourlyData,
}) => {
  const dataToDisplay = hourlyData.filter(
    (_: HourlyWeatherData, index: number) => index < 24 && index % 2 === 0,
  );

  const [dataChoice, setDataChoice] = React.useState<DataChoice>(
    DataChoice.TEMPERATURE,
  );

  const getValue = (data: HourlyWeatherData) => {
    switch (dataChoice) {
      case DataChoice.TEMPERATURE:
        return data.temp;
      case DataChoice.FEELS_LIKE:
        return data.feels_like;
      case DataChoice.WIND_SPEED:
        return data.wind_speed;
    }
  };
  const getUnits = () => {
    switch (dataChoice) {
      case DataChoice.TEMPERATURE:
      case DataChoice.FEELS_LIKE:
        return '°';
      case DataChoice.WIND_SPEED:
        return ' mph';
    }
  };
  const values = dataToDisplay.map((data) => getValue(data));
  const min = Math.min(...values);
  const max = Math.max(...values);

  /**
   * Get the width percentage for the value relative to the entire data set.
   */
  const getTemperatureWidthOffset = (temperature: number): string => {
    // TODO: magic numbers
    const minWidth = 0.45;
    const maxWidth = 0.88;

    const normalizedTemperature = (Math.round(temperature) - min) / (max - min);
    const width = minWidth + normalizedTemperature * (maxWidth - minWidth);

    return `${width * 100}%`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hourly</Text>
      {dataToDisplay.map(
        (
          data: HourlyWeatherData,
          index: number,
          array: HourlyWeatherData[],
        ) => {
          const currentDescription = getWeatherDescription(data.weather[0]);
          const previousDescription = getWeatherDescription(
            array[index - 1]?.weather[0],
          );

          const description =
            currentDescription === previousDescription
              ? null
              : currentDescription;

          return (
            <View style={styles.hourLine}>
              <Text style={styles.time}>{getTimeString(data.dt, false)}</Text>
              <View
                style={{
                  ...styles.valueLine,
                  width: getTemperatureWidthOffset(getValue(data)),
                }}>
                {description ? (
                  <Text style={styles.description}>{description}</Text>
                ) : null}
                <View style={styles.line} />
                <Text style={styles.value}>
                  {Math.round(getValue(data))}
                  {getUnits()}
                </Text>
              </View>
            </View>
          );
        },
      )}
      <ButtonGroup
        buttons={['Temperature', 'Feels Like', 'Wind Speed']}
        buttonStyle={styles.buttonGroupButton}
        containerStyle={styles.buttonGroupContainer}
        buttonContainerStyle={styles.buttonGroupContainer}
        selectedIndex={dataChoice}
        onPress={(index) => setDataChoice(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  hourLine: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    padding: 2,
  },
  time: {
    width: '14%',
    textAlign: 'right',
  },
  valueLine: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingStart: 12,
    paddingEnd: 8,
  },
  description: {
    fontStyle: 'italic',
    fontSize: 12,
    marginEnd: 8,
  },
  line: {
    backgroundColor: '#d9d7dc',
    height: 2,
    flexGrow: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d9d7dc',
  },
  value: {
    paddingStart: 8,
    padding: 4,
    paddingTop: 3,
    paddingBottom: 3,
    marginStart: 8,
    backgroundColor: '#f3f0f6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b5b3b8',
  },
  buttonGroupButton: {
    borderRadius: 10,
    backgroundColor: '#f3f0f6',
  },
  buttonGroupContainer: {
    borderColor: '#fff',
  },
  header: {
    alignSelf: 'center',
  },
});