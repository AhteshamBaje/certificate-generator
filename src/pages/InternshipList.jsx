import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const InternshipList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();


    const searchStudent = async () => {
        try {
            const searchSname = await axios.get(`http://localhost:8003/api/searchdata/${searchQuery}`);
            if(searchSname.data.success){
                setFilteredData(searchSname.data.data)
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    const handlePrev = () => {
        setPage(page - 1);
    }

    const handleNext = () => {
        setPage(page + 1);
    }
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8003/api/studentlist/${page}`);
            if (!response.data || response.data.data.length === 0) {
                console.log("No data found.");
                alert("No data found.");
                return;
            }
            console.log("Fetched data:", response.data.data);
            setData(response.data.data);
            setFilteredData(response.data.data);
            setTotalPages(response.data.totalPages)
        } catch (error) {
            console.log(error.message);
            alert("An error occurred while fetching the data.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);


    const delIntern = async (id) => {
        const confirm = window.confirm("Do you want to delete..?");
        if (!confirm) return;

        try {
            const res = await axios.delete(`http://localhost:8003/api/delIntern/${id}`);
            if (res.status === 200) {
                alert("Intern deleted successfully");
                setData(prevData => prevData.filter(intern => intern._id !== id));
                setFilteredData(prevData => prevData.filter(intern => intern._id !== id));
            }
        } catch (error) {
            console.error("Error deleting intern:", error);
        }
    };

    return (
        <>
            <nav className="bg-blue-600 text-white text-center py-4 shadow-lg">
                <h1 className="text-2xl font-bold">Internship Certificates List</h1>
                <ul className="container mx-auto flex justify-between items-center px-20">
                    <li>
                        <Link to="/internshipForm" className="hover:underline font-bold text-xl">Back</Link>
                    </li>
                    <li>
                        <Link to="/" className="hover:underline font-bold text-xl">Home</Link>
                    </li>
                </ul>
            </nav>

            {/* Search Bar */}
            <div className="flex justify-center mt-4">
                <input
                    type="text"
                    placeholder="Search by student name..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        if(e.target.value===""){
                            fetchData()
                        }
                    }}
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
                />
                <button className='bg-slate-500 text-white rounded-xl px-3' onClick={searchStudent}>search</button>
            </div>

            <div className="table-container flex justify-center items-center mx-10 py-5 overflow-x-auto">
                <table className="w-full max-w-5xl border-collapse">
                    <caption className="text-center font-bold text-2xl py-5">INTERNSHIP CERTIFICATES</caption>
                    <thead>
                        <tr className="bg-black text-white max-h-fit">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Student Name</th>
                            <th className="border p-2">USN</th>
                            <th className="border p-2">Course</th>
                            <th className="border p-2">Start Date</th>
                            <th className="border p-2">End Date</th>
                            <th className="border p-2">Certificate Number</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((intern) => (
                                <tr key={intern._id} className="border hover:bg-gray-100">
                                    <td className="border p-2">{intern._id}</td>
                                    <td className="border p-2">{intern.studentName}</td>
                                    <td className="border p-2">{intern.usn}</td>
                                    <td className="border p-2">{intern.course}</td>
                                    <td className="border p-2">{new Date(intern.startDate).toLocaleDateString("en-IN")}</td>
                                    <td className="border p-2">{new Date(intern.endDate).toLocaleDateString("en-IN")}</td>
                                    <td className="border p-2">{intern.certificateNumber}</td>
                                    <td className="border p-2 flex space-x-2">
                                        <button
                                            className="bg-red-700 text-white hover:bg-red-400 px-2 py-1 rounded-md"
                                            onClick={() => delIntern(intern._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-blue-700 text-white hover:bg-blue-400 px-2 py-1 rounded-md"
                                            onClick={() => navigate(`/Internshipcertificate/${intern._id}`)}
                                        >
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>


            </div>
            <div className='flex justify-between p-4'>
                <button type='button' className='bg-slate-600 px-2 text-white rounded-lg' onClick={handlePrev} disabled={page === 1 ? true : false} >previous</button>
                <p className='p-3 border-b-2 rounded-lg'>page {page} of {totalPages}</p>
                <button type='button' className='bg-slate-600 px-2 text-white rounded-lg' onClick={handleNext} disabled={page === totalPages ? true : false}>Next</button>
            </div>
        </>
    );
};

export default InternshipList;
