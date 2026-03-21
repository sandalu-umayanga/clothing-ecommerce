import React, { useState, useRef, useEffect } from 'react';
import { TableauViz, TableauAuthoringViz } from '@tableau/embedding-api-react';
import api from '../api/axiosConfig';

const AnalyticsDashboard = () => {
  const [vizLoaded, setVizLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [tableauToken, setTableauToken] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthoring, setIsAuthoring] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);
  
  const vizRef = useRef(null);

  const TABLEAU_URL = "https://prod-in-a.online.tableau.com/t/sandaluumayanga2002-e068684934/views/ThreadWorksAnalytics/BusinessOverview";

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await api.get('/tableau/token');
        setTableauToken(response.data.token);
      } catch (err) {
        console.error("Failed to fetch Tableau token:", err);
        setError("Security Error: Could not establish a secure connection.");
      }
    };
    fetchToken();
  }, []);

  const handleVizLoad = () => {
    setVizLoaded(true);
  };

  // This runs when you click "Publish" inside the Tableau Editor
  const handleWorkbookPublished = () => {
    setSaveMessage(true);
    setTimeout(() => {
        setSaveMessage(false);
        setIsAuthoring(false); // Return to view mode after saving
    }, 3000);
  };

  const applyFilter = async (category) => {
    setActiveFilter(category);
    if (!vizRef.current || isAuthoring) return;
    try {
      const dashboard = vizRef.current.workbook.activeSheet;
      if (category === 'All') {
        await dashboard.applyFilterAsync("Category", [""], "remove");
      } else {
        await dashboard.applyFilterAsync("Category", [category], "replace");
      }
    } catch (error) { console.error(error); }
  };

  const handleExportPDF = () => {
    if (vizRef.current && !isAuthoring) {
      vizRef.current.exportToPDF();
    }
  };

  if (error) {
    return <div className="max-w-[95rem] mx-auto px-4 py-20 text-center font-bold text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {saveMessage && (
        <div className="fixed top-20 right-10 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce font-bold">
            ✓ Dashboard Saved Successfully!
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Intelligence</h1>
          <p className="text-gray-500">{isAuthoring ? "Design Mode: Use the 'File > Publish' menu inside the frame to save." : "View Mode: Interactive performance metrics"}</p>
        </div>

        <div className="flex items-center space-x-4">
          {!isAuthoring && (
            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                {['All', 'Furniture', 'Technology', 'Office Supplies'].map((cat) => (
                <button key={cat} onClick={() => applyFilter(cat)} disabled={!vizLoaded} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeFilter === cat ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-600'}`}>{cat}</button>
                ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button 
                onClick={() => { setIsAuthoring(!isAuthoring); setVizLoaded(false); }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-bold transition ${isAuthoring ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
                <span>{isAuthoring ? "Exit Editor" : "Edit Dashboard"}</span>
            </button>

            {!isAuthoring && (
                <button onClick={handleExportPDF} disabled={!vizLoaded} className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition">Export</button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[800px] relative">
        {!vizLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-bold">Connecting to BI Engine...</p>
            </div>
          </div>
        )}

        {tableauToken && !isAuthoring && (
          <TableauViz
            ref={vizRef}
            src={TABLEAU_URL}
            token={tableauToken}
            toolbar="hidden"
            hideTabs={true}
            onFirstInteractive={handleVizLoad}
            className="w-full h-[800px]"
          />
        )}

        {tableauToken && isAuthoring && (
          <TableauAuthoringViz
            src={TABLEAU_URL}
            token={tableauToken}
            onFirstInteractive={handleVizLoad}
            onWorkbookPublished={handleWorkbookPublished} // The magic listener!
            className="w-full h-[800px]"
          />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;