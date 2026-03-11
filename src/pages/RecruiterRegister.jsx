import { useState } from "react";

function RecruiterRegister(){

const [form,setForm] = useState({})

const change=(e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const register= async ()=>{

await fetch("http://localhost:5000/api/recruiter/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)

})

alert("Recruiter Registered")

}

return(

<div className="p-10 flex flex-col gap-3">

<h1 className="text-3xl font-bold">Recruiter Register</h1>

<input name="name" placeholder="Name" onChange={change}/>
<input name="email" placeholder="Email" onChange={change}/>
<input name="password" placeholder="Password" onChange={change}/>
<input name="company" placeholder="Company" onChange={change}/>

<button
className="bg-green-500 text-white p-2"
onClick={register}
>
Register
</button>

</div>

)

}

export default RecruiterRegister