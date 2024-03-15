// UpdateModuleForm.jsx
import React from 'react';
import CreateModule from './CreateModule';

const UpdateModule = ({ onUpdate, moduleId }) => {
  return (
    <div>
      <h2>Update Module</h2>
      <CreateModule onCreate={onUpdate} moduleId={moduleId} />
    </div>
  );
};

export default UpdateModule;
