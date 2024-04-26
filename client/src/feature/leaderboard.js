import PageTitle from "../components/PageTitle";

function App() {
    return(
        <div>
            <PageTitle title="Leaderboards"/>
            <div></div> {/* Filter Box */}
            <div className="grid overflow-y-auto grid-flow-row">
                {/* ?.map((props) =>) */}
                <div className="flex justify-between">
                    <h1 className='text-xl font-bold'>(Rank)</h1>
                    <h1 className='text-xl font-bold'>(Username)</h1>
                    <h1 className='text-xl font-bold'>(Score)</h1>
                    <h1 className='text-xl font-bold'>(Time)</h1>
                </div>
            </div> {/* Display Plays */}
            <h1 className="text-bold text-xl">It Appears Here</h1>
        </div>
    )
}

export default App;