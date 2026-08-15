// Placeholder - the actual add screen is the modal at /add-transaction
// This file exists to satisfy the tab navigator requirement
import { Redirect } from 'expo-router';

export default function AddTab() {
  return <Redirect href="/add-transaction" />;
}
