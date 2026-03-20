import React, { useState } from 'react';
import api from '../api/axiosConfig';

const CustomDesignForm = () => {
  const [file, setFile] = useState(null);
  const [specifications, setSpecifications] = useState('');
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setStatus({ ...status, error: "Please select an image file." });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    // When sending files, we MUST use FormData instead of standard JSON
    const formData = new FormData();
    formData.append('file', file);
    formData.append('specifications', specifications);
    formData.append('userId', 1); // Hardcoding our dummy user ID for now

    try {
      // Notice we are passing formData, not a JSON object
      await api.post('/custom-designs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setStatus({ loading: false, success: true, error: null });
      setFile(null);
      setSpecifications('');
      
      // Reset the file input visually
      document.getElementById('file-upload').value = '';
      
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus({ loading: false, success: false, error: "Failed to upload design. Please try again." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Request a Custom Design</h2>
        <p className="text-gray-500 mb-8">Upload your artwork and tell us how you want it printed.</p>

        {status.success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p className="font-bold">Success!</p>
            <p>Your custom design has been uploaded and is pending review.</p>
          </div>
        )}

        {status.error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Design File (PNG, JPG, PDF)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  {file ? `Selected: ${file.name}` : "Up to 10MB"}
                </p>
              </div>
            </div>
          </div>

          {/* Specifications Text Area */}
          <div>
            <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-2">
              Fabric & Printing Specifications
            </label>
            <textarea
              id="specifications"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
              placeholder="e.g., 100% Cotton Hoodie, size Large, print logo exactly in the center of the chest."
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={status.loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${status.loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'} transition-colors`}
            >
              {status.loading ? 'Uploading...' : 'Submit Design'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomDesignForm;