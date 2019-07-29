import * as React from 'react';
import axios from 'axios';

export default () => {
    const [theme, setTheme] = React.useState("");
    const [location, setLocation] = React.useState("");
    
    const saveNewDojo = () => {
        axios.post('http://localhost:8080/api/dojos', {
            theme,
            location,
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <h2>New dojo form !</h2>
            <div>
                <div>
                    <span>Theme : </span>
                    <input type="text" value={theme} onChange={e => setTheme(e.target.value)} />
                </div>
                <div>
                    <span>Location : </span>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <input type="button" onClick={saveNewDojo} value="Save" />
            </div>
        </div>
    );
}