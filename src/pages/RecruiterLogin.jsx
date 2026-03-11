import { useState } from "react";

function RecruiterLogin() {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const login = async () => {

const res = await fetch("http://localhost:5000/api/recruiter/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

})

const data = await res.json();

alert(data.message);

if(data.success){
localStorage.setItem("recruiterId",data.recruiter._id)
window.location="/dashboard"
}

};

return (

<div className="flex flex-col items-center p-10 gap-4">

<h1 className="text-3xl font-bold">Recruiter Login</h1>

<input
className="border p-2"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
className="border p-2"
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="bg-blue-500 text-white p-2"
onClick={login}
>
Login
</button>

</div>

)

}

export default RecruiterLogin;