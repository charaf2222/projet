import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateModule from './CreateModule';

const ModuleTreeView = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = () => {
    axios.get('http://127.0.0.1:8000/api/Modules/')
      .then(response => {
        setModules(response.data);
      })
      .catch(error => {
        console.error('Error fetching modules:', error);
      });
  };

  const handleSelectModule = (module) => {
    setSelectedModule(module);
  };

  const handleCreateButtonClick = () => {
    setSelectedModule(null);
  };

  const deleteModule = (moduleId) => {
    axios.delete(`http://127.0.0.1:8000/api/Modules/${moduleId}/`)
      .then(() => {
        fetchModules(); // Refresh the modules list after deletion
        if (selectedModule && selectedModule.id === moduleId) {
          setSelectedModule(null); // Deselect if the deleted module was selected
        }
      })
      .catch(error => {
        console.error('Error deleting module:', error);
      });
  };

  return (
    <div>
      <h2>Module TreeView</h2>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '110%', marginRight: '20px' }}>
          <h3>Module List</h3>
          <ul>
            {modules.map(module => (
              <li key={module.id}>
                {module.Nom} - {module.Statut}
                <button onClick={() => handleSelectModule(module)}>Edit</button>
                <button onClick={() => deleteModule(module.id)} style={{ marginLeft: '10px' }}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={handleCreateButtonClick}>Create New Module</button>
        </div>
        
        <div style={{ width: '50%' }}>
          <h3>{selectedModule ? 'Update Module' : 'Create Module'}</h3>
          <CreateModule
            onCreateOrUpdate={fetchModules}
            moduleId={selectedModule ? selectedModule.id : null}
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleTreeView;
