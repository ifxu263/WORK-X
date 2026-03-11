import { useEffect, useState } from "react"
import JobPostForm from "../components/JobPostForm"

function RecruiterDashboard(){

const [jobs,setJobs] = useState([])
const [applicants,setApplicants] = useState([])

const recruiterId = localStorage.getItem("recruiterId")

/* ---------- LOAD RECRUITER JOBS ---------- */

useEffect(()=>{

fetch(`http://localhost:5000/api/recruiter/jobs/${recruiterId}`)
.then(res=>res.json())
.then(data=>setJobs(data))

},[])

/* ---------- LOAD APPLICANTS ---------- */

useEffect(()=>{

fetch(`http://localhost:5000/api/recruiter/applicants/${recruiterId}`)
.then(res=>res.json())
.then(data=>{
if(data.success){
setApplicants(data.applicants)
}
})

},[])

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-5">
Recruiter Dashboard
</h1>

{/* ---------- JOB POST FORM ---------- */}

<JobPostForm/>

{/* ---------- RECRUITER JOBS ---------- */}

<h2 className="text-2xl mt-10">My Jobs</h2>

{jobs.map(job=>(

<div key={job._id} className="border p-3 mt-2 rounded">

<h3 className="font-bold">{job.title}</h3>

<p>{job.company}</p>

<p>{job.location}</p>

</div>

))}

{/* ---------- APPLICANTS SECTION ---------- */}

<h2 className="text-2xl mt-10">Applicants</h2>

{applicants.length === 0 && (
<p className="mt-2">No applicants yet</p>
)}

{applicants.map(app=>(
<div
key={app._id}
className="border p-4 mt-3 rounded bg-gray-50"
>

<h3 className="font-bold">{app.name}</h3>

<p>Email: {app.email}</p>

<p>{app.message}</p>

<p className="text-sm text-gray-500">
Applied for: {app.jobTitle}
</p>

<a
href={`mailto:${app.email}`}
className="text-blue-500 underline"
>
Contact Applicant
</a>

</div>
))}

</div>

)

}

export default RecruiterDashboard