import { useState, useEffect,useRef } from "react";
import { db } from '../firebase-config';
import { getDocs, collection, doc, deleteDoc, query, where, orderBy, limit } from "firebase/firestore";
import { async } from "@firebase/util";


const useFetchFbCollection = (docName) => {
    const cache = useRef({});
    const [status, setStatus] = useState('idle')
    const [data, setData] = useState([])

    useEffect(() => {
        if (!docName) return

        const collectionRef = collection(db, docName)
        const fetch = async () => {
            setStatus('fetching')
            if (cache.current[docName]) {
                console.log('cached')
                const data = cache.current[docName]
                setData(data)
            } else {
                console.log('fetching...')
                const q = query(collectionRef, orderBy("createTime", "desc"), limit(3));
                const result = await getDocs(q)
                const data = result.docs.map(doc => ({...doc.data(), id: doc.id}))
                setData(data)
            }
            
            setStatus('fetched');
        }

        fetch()
       
    }, [docName])


    return { status, data }
}

export default useFetchFbCollection