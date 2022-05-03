import logo from './logo.svg';
import './App.css';

import {useEffect, useState} from "react";
import {ethers, Signer} from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"
import {use} from "chai";


function App() {
    const [data, setData] = useState("");
    const [contract, setContract] = useState("");

    const getData = async () => {
        const data = await contract.greet();
        setData(data);
    }

    const updateData = async () => {
        const transaction = await contract.setGreeting(data);
        await transaction.wait();
        getData();
    }

    const initConnection = async () => {
        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({method: "eth_requestAccounts"});
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            setContract(
                new ethers.Contract(
                    "0x5fbdb2315678afecb367f032d93f642f64180aa3",
                    Greeter.abi,
                    signer
                )
            );
        } else {
            console.log("please install metamask.")
        }
    };

    useEffect(() => {
        initConnection();
    }, [])

    return (
        <div className="App">
            <button onClick={getData}>getdata</button>
            <button onClick={updateData}>set data</button>

            <input
                onChange={(e)=> setData(e.target.value)}
                placeholder="new greeting"
            />

            <p>{data}</p>
        </div>
    );
}

export default App;
