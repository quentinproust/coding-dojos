import * as React from 'react';
import axios from 'axios';

export default () => {

    const [ideas, setIdeas] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        axios.get('http://localhost:8080/dojo-ideas')
        .then((response) => {
            console.log(response);
            setIdeas(response.data);
        })
        .catch((error) => {
            console.log(error);
            setError(error);
        });
    }, []);

    console.log({ ideas });
    
    return (
        <div>
            <h2>Dojo Ideas !</h2>
            <div>
                {ideas.map(idea => (
                    <div key={idea.id}>
                        <h3>{idea.theme}</h3>
                        <div>{idea.status}</div>
                        <div>{idea.votes.length} ({idea.votes.join(',')})</div>
                    </div>
                ))}
            </div>
        </div>
    );
}