

/*
const [oldData, setOldData] = useState({
    name: "",
    gender: "",
    password: ""
})


const [curData, setCurData] = useState({
    name: "",
    gender: "",
    password: ""
})
*/

function App(){
    return (
        <div>
            <h1>Profile</h1>
            <div className="divider"></div>
            <form className="flex flex-col">
                <div className="flex flex-col my-2">
                    <label>Username</label>
                    <input className="w-10 border-solid border-black border-4 my-2 w-40"></input>
                </div>
                <div className="flex flex-col my-2">
                    <label>Gender</label>
                    <input className="w-10 border-solid border-black border-4 my-2 w-40"></input>
                </div>
                <div className="flex flex-col my-2">
                    <label>Password</label>
                    <input className="w-10 border-solid border-black border-4 my-2 w-40"></input>
                </div>
                <button className="border-solid border-black border-4 my-2 w-40">Confirm changes</button>
            </form>
        </div>
    )
}

export default App;