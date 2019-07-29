import * as React from 'react';
import axios from 'axios';

export default () => {

    const [polls, setPolls] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        axios.get('http://localhost:8080/date-polls')
        .then((response) => {
            console.log(response);
            setPolls(response.data);
        })
        .catch((error) => {
            console.log(error);
            setError(error);
        });
    }, []);

    console.log({ polls });
    
    return (
        <div>
            <h2>Date Polls !</h2>
            <div>
                {polls.map(poll => (
                    <div key={poll.id}>
                        <h3>{poll.dojoIdea.theme}</h3>
                        <div>{poll.dojoIdea.status}</div>

                        <ul>
                            {poll.timeSlots.map(slot => (
                                <li key={slot.id}>
                                    {slot.date} ({slot.timeSlot || "no time slot defined"})
                                    <span>{slot.votes.length}</span>
                                    <ul>
                                        {slot.votes.map(vote => (
                                            <li key={vote.name}>
                                                {vote.name} : {vote.status}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}