import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from "../freatures/counter/counterSlice";

function Counter(){
    const count = useSelector((state)=>state.counter.value)
    const dispatch = useDispatch()

    reutrn 
}