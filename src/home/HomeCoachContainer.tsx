import firebase from 'firebase';
import React, { FC, useEffect, useState } from 'react';
import { Coach } from '../Coach';

export const HomeCoachContainer: FC = () => {
  const [sentences, setSentences] = useState<Array<string>>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const doc = await firebase
      .firestore()
      .collection('coaches')
      .doc('basic')
      .get();
    setSentences(doc.data().homeSentences);
  };

  return <Coach sentences={sentences} />;
};
