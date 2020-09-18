import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core';
import { db, storage } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css'

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(500);
    const [text, setText] = useState('');
    const [category, setCategory] = useState('coffee');

    useEffect(() => {
        setCategory(category);
        console.log(category);
    }, [category]);

    const handleSelect = (e) => {
        setCategory(e.target.value);
    };

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function...
                console.log(error);
                alert(error.meesage);
            },
            () => {
                // complete function...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection(category).add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            imgUrl: url,
                            name: name,
                            price: price,
                            text: text,
                            username: username
                        });

                        setProgress(0);
                        setName("");
                        setPrice(500);
                        setText("");
                        setCategory('coffee');
                        setImage(null);
                    })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <select value={category} onChange={handleSelect}>
                <option value="coffee">coffee</option>
                <option value="non-coffee">non-coffee</option>
                <option value="tea">tea</option>
                <option value="dessert">dessert</option>
            </select>
            <input type="text" placeholder="메뉴 이름" onChange={event => setName(event.target.value)} value={name}/>
            <input type="number" placeholder="메뉴 가격" onChange={event => setPrice(event.target.value)} value={price} min="500" max="10000" step="100"/>
            <input type="text" placeholder="메뉴 설명" onChange={event => setText(event.target.value)} value={text}/>
            <input type="file" onChange={handleChange} />
            <Button className="imageupload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
