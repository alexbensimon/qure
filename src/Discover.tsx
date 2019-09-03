import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { DiscoverTopics } from './discover/DiscoverTopics';
import { Challenge } from './globalTypes';

type State = {
  section: '' | 'categories';
  challenges: Array<Challenge>;
};

export class Discover extends Component<{}, State> {
  state: State = {
    section: '',
    challenges: [],
  };

  render() {
    const { section } = this.state;
    return (
      <ScrollView style={styles.container}>
        {!section && (
          <>
            <Card title="Défi du jour"></Card>
            <Card title="Défi de la semaine"></Card>
            <Card title="Défi du mois"></Card>
            <Card title="Catégories">
              <Button
                title="+"
                onPress={() => this.setState({ section: 'categories' })}
              />
            </Card>
          </>
        )}
        {section === 'categories' && (
          <>
            <Button
              title="Découvrir"
              onPress={() => this.setState({ section: '' })}
            />
            <DiscoverTopics />
          </>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
});
