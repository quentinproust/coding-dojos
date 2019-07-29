import * as React from 'react';
import axios from 'axios';


const Interested = ({ dojo }) => {
    const [maybeInterested, setMaybeInterested] = React.useState(false);
    const [name, setName] = React.useState('');
    
    return (
        <div>
            <h3>Interested !</h3>

            <ul>
                {dojo.interested.map(interest => (
                    <li>XXX</li>
                ))}
            </ul>
            <div>
                {!maybeInterested && (
                    <input type="button" value="Interested ?" onClick={() => setMaybeInterested(true)} />
                )}
                {maybeInterested && (
                    <>
                        <input type="text" placeholder="name :" value={name} onChange={e => setName(e.target.value)} />
                        <input type="button" value="✔" disabled={name.length > 0} />
                        <input type="button" value="✘" disabled={name.length > 0} />
                    </>
                )}
            </div>
        </div>
    );
};

export default () => {

    const [dojos, setDojos] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        axios.get('http://localhost:8080/api/dojos')
            .then((response) => {
                console.log(response);
                setDojos(response.data);
            })
            .catch((error) => {
                console.log(error);
                setError(error);
            });
    }, []);

    console.log({ dojos });
    
    return (
        <div>
            <h2>Dojos !</h2>
            <div>
                {dojos.map(dojo => (
                    <div key={dojo.id}>
                        <h3>{dojo.theme}</h3>
                        <div>{dojo.location}</div>
                        <div>{dojo.status}</div>

                        <Interested dojo={dojo} />
                    </div>
                ))}
            </div>
        </div>
    );
}
