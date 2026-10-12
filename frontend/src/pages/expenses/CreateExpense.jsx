import React from 'react';
import { Navigate } from 'react-router-dom';

export const CreateExpense = () => {
  return <Navigate to="/expenses?new=true" replace />;
};

export default CreateExpense;
