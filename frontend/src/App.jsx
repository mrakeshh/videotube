import { useSelector, useDispatch } from "react-redux"
import { setUser, clearUser } from "./features/auth/authSlice"

const App = () =>{
const user = useSelector((state) => state.auth.user)
const dispatch = useDispatch()

return (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
    <h1 className="text-3xl font-bold">
      {user ? `Hello, ${user.username}` : "Not logged in"}
      {console.log(user)}
    </h1>

    <div className="flex gap-3">
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={() => dispatch(setUser({ username: 'test'}))}
      >
        Set user
      </button>

      <button
        className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
        onClick={() => dispatch(clearUser())}
      >
        Clear user
      </button>
    </div>
  </div>
)
}

export default App