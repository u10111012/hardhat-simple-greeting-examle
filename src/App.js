import './App.css';

import {useEffect, useState} from "react";
import {ethers, Signer} from "ethers";
import Manager from "./artifacts/contracts/Manager.sol/Manager.json"

function App() {
    const [name, setName] = useState("");
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [tickets, setTickets] = useState([]);

    const getTickets = async () => {
        let res = await contract.getTickets();

        setTickets(res)
    }

    const createTicket = async (_name) => {
        let res = await contract.createTicket(_name);

        getTickets()
    }

    const updateTicketStatus = async (_index, _status) => {
        const transaction = await contract.updateTicketStatus(_index, _status);
        await transaction.wait();
        getTickets();
    }

    const renameTicket = async (_index) => {
        let newName = prompt("please enter new ticket name", "");
        const transaction = await contract.updateTicketName(_index, newName);
        await transaction.wait();
        getTickets();
    }

    const initConnection = async () => {
        if (typeof window.ethereum !== "undefined") {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const newSigner = provider.getSigner();
            setAccount(accounts[0]);
            setContract(
                new ethers.Contract(
                    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                    Manager.abi,
                    newSigner
                )
            );
        } else {
            console.log("please install metamask")
        }
    };

    useEffect(() => {
        initConnection()
    }, []);

    console.log(tickets)

    return (
        <div className="page">
            <div className="header">

                <p>Task Manager</p>
                <p>{account !== "" ? account.substring(0, 9) :
                    <button className="big_button" onClick={initConnection}>connect</button>}</p>
            </div>
            <div className="input_section">
                <div>
                    <button className="big_button" onClick={() => {
                        createTicket(name)
                    }}>create ticket
                    </button>

                    <input className="input"
                           onChange={(e) => setName(e.target.value)}
                           placeholder="ticket name"
                    />
                </div>
                <button className="big_button" onClick={getTickets}>load data</button>
            </div>
            <div className="main">
                <div className="main_col" style={{backgroundColor: "lightPink"}}>
                    <div className="main_col_heading">Todo</div>
                    {tickets.map((t, i) => ({id: i, item: t}))
                        .filter((t) => t.item.status == 0)
                        .map((ticket, index) => {
                            return (
                                <div key={index} className="main_ticket_card">
                                    <p className="main_ticket_card_id">#{ticket.id}</p>
                                    <p>{ticket.item.name}</p>
                                    <div className="main_ticket_button_section">
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightBlue"}}
                                            onClick={() => {
                                                updateTicketStatus(ticket.id, 1)
                                            }}
                                        >
                                            busy
                                        </button>
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightGreen"}}
                                            onClick={() => {
                                                updateTicketStatus(ticket.id, 2)
                                            }}
                                        >
                                            done
                                        </button>
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightGrey"}}
                                            onClick={() => {
                                                renameTicket(ticket.id)
                                            }}
                                        >
                                            rename
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="main_col" style={{backgroundColor: "lightBlue"}}>
                    <div className="main_col_heading">Busy</div>
                    {tickets.map((t, i) => ({id: i, item: t}))
                        .filter((t) => t.item.status == 1)
                        .map((ticket, index) => {
                            return (
                                <div key={index} className="main_ticket_card">
                                    <p className="main_ticket_card_id">#{ticket.id}</p>
                                    <p>{ticket.item.name}</p>
                                    <div className="main_ticket_button_section">
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightBlue"}}
                                            onClick={() => {
                                                updateTicketStatus(ticket.id, 0)
                                            }}
                                        >
                                            todo
                                        </button>
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightGreen"}}
                                            onClick={() => {
                                                updateTicketStatus(ticket.id, 2)
                                            }}
                                        >
                                            done
                                        </button>
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightGrey"}}
                                            onClick={() => {
                                                renameTicket(ticket.id)
                                            }}
                                        >
                                            rename
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="main_col" style={{backgroundColor: "lightGreen"}}>
                    <div className="main_col_heading">Done</div>
                    {tickets.map((t, i) => ({id: i, item: t}))
                        .filter((t) => t.item.status == 2)
                        .map((ticket, index) => {
                            return (
                                <div key={index} className="main_ticket_card">
                                    <p className="main_ticket_card_id">#{ticket.id}</p>
                                    <p>{ticket.item.name}</p>
                                    <div className="main_ticket_button_section">
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightBlue"}}
                                            onClick={() => {
                                                updateTicketStatus(ticket.id, 0)
                                            }}
                                        >
                                            todo
                                        </button>
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightGreen"}}
                                            onClick={() => {
                                                updateTicketStatus(ticket.id, 1)
                                            }}
                                        >
                                           busy
                                        </button>
                                        <button
                                            className="small-button"
                                            style={{backgroundColor: "lightGrey"}}
                                            onClick={() => {
                                                renameTicket(ticket.id)
                                            }}
                                        >
                                            rename
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
