import React, { useState } from "react";
import { IoIosPersonAdd, IoMdTrash, IoMdCloudUpload } from "react-icons/io";

const ApplicantList = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [selectedApplicantIndex, setSelectedApplicantIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleButtonClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleSaveClick = () => {
    if (applicantName.trim() !== "") {
      const newApplicants = [
        ...applicants,
        { name: applicantName, documents: [] },
      ];
      setApplicants(newApplicants);
      setApplicantName("");
      setIsPopupOpen(false);

      if (newApplicants.length > currentPage * itemsPerPage) {
        setCurrentPage(Math.ceil(newApplicants.length / itemsPerPage));
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileToUpload(files); 
  };

  const handleSaveFileClick = () => {
    if (documentName.trim() !== "" && fileToUpload) {
      const updatedApplicants = [...applicants];
      updatedApplicants[selectedApplicantIndex].documents.push({
        documentName,
        files: fileToUpload,
      });
      setApplicants(updatedApplicants);
      setDocumentName("");
      setFileToUpload(null);
      setSelectedApplicantIndex(null);
    }
  };

  const handleCancelFileUpload = () => {
    setDocumentName("");
    setFileToUpload(null);
    setSelectedApplicantIndex(null);
  };

  const handleDeleteClick = (index) => {
    const updatedApplicants = applicants.filter((_, i) => i !== index);
    setApplicants(updatedApplicants);
    const totalPages = Math.ceil(updatedApplicants.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  };

  const handleUploadClick = (index) => {
    setSelectedApplicantIndex(index);
  };

  const indexOfLastApplicant = currentPage * itemsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - itemsPerPage;
  const currentApplicants = applicants.slice(
    indexOfFirstApplicant,
    indexOfLastApplicant
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(applicants.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">Applicant Details</h1>
        <button
          onClick={handleButtonClick}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 transition-all p-3 rounded-lg shadow-md text-lg font-medium text-white"
        >
          <IoIosPersonAdd />
          Add Applicant
        </button>
      </div>

      <div className="flex justify-center mb-10">
        <hr className="bg-white opacity-40 w-full max-w-4xl h-1 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {currentApplicants.map((applicant, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-80 p-4 sm:p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 relative"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
              {applicant.name}
            </h2>

            {applicant.documents.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-left text-gray-800 font-semibold">Document Name</th>
                      <th className="border px-2 py-1 text-left text-gray-800 font-semibold">File(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicant.documents.map((doc, docIndex) => (
                      <tr
                        key={docIndex}
                        className={`${
                          docIndex % 2 === 0 ? "bg-gray-300" : "bg-gray-200"
                        } hover:bg-gray-300`}
                      >
                        <td className="border px-2 py-1 text-green-600 font-medium">
                          {doc.documentName}
                        </td>
                        <td className="border px-2 py-1">
                          {doc.files.map((file, fileIndex) => (
                            <a
                              key={fileIndex}
                              href={URL.createObjectURL(file)}
                              download={file.name}
                              className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                            >
                              {file.name}
                            </a>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedApplicantIndex === index && (
              <div className="mt-4">
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className="border p-2 w-full rounded-md mb-2"
                />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="border p-2 w-full rounded-md mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveFileClick}
                    className="bg-green-500 p-2 rounded-md text-white shadow-md hover:bg-green-600 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelFileUpload}
                    className="bg-red-500 p-2 rounded-md text-white shadow-md hover:bg-red-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => handleUploadClick(index)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 transition-all p-2 rounded-md text-white mt-4"
            >
              <IoMdCloudUpload />
              Upload Document
            </button>

            <button
              onClick={() => handleDeleteClick(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <IoMdTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-8 text-white">
        <button
          onClick={handlePrevPage}
          className={`p-3 rounded-md text-white shadow-md ${
            currentPage === 1 ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-500"
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg sm:text-xl font-medium mb-4 sm:mb-0">
          Page {currentPage} of {Math.ceil(applicants.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          className={`p-3 rounded-md text-white shadow-md ${
            currentPage === Math.ceil(applicants.length / itemsPerPage)
              ? "bg-gray-400"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          disabled={currentPage === Math.ceil(applicants.length / itemsPerPage)}
        >
          Next
        </button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Applicant</h2>
            <input
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Enter applicant name"
              className="border p-2 w-full rounded-md mb-4"
            />
            <button
              onClick={handleSaveClick}
              className="bg-green-500 p-3 rounded-md text-white shadow-md hover:bg-green-600 transition-all"
            >
              Save
            </button>
            <button
              onClick={handleButtonClick}
              className="bg-red-500 p-3 rounded-md text-white shadow-md hover:bg-red-600 transition-all ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantList;
