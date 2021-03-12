import * as React from 'react';
import { Button } from 'react-native';

export default function Stateful() {
  const [count, setCount] = React.useState(0);
  return (
    <Button
      title={`The count is ${count}!`}
      onPress={() => setCount(i => i + 1)}
    />
  );
}
