import { useState, useEffect,useRef } from "react";
import { db } from '../firebase-config';
import { getDocs, collection, doc, deleteDoc, query, where, startAfter, orderBy, limit } from "firebase/firestore";
import { async } from "@firebase/util";
import { useQuery } from "react-query";

const useFetchFbCollection = (docName, dataEmpty) => {
    const [status, setStatus] = useState('idle')
    const [data, setData] = useState([])
    const [lastPage, setLastPage] = useState(null)
    const {} = useQuery('all-post', () => {

    })

    useEffect(() => {
        fetchData()
    }, [docName])

    const fetchData = (loadMore) => {
        if (!docName) return

        const collectionRef = collection(db, docName)
        const fetch = async () => {
            setStatus('fetching')

            var q;
            if (lastPage && loadMore) {
                q = query(collectionRef, orderBy("createTime", "desc"), startAfter(lastPage), limit(3))
            } else {
                q = query(collectionRef, orderBy("createTime", "desc"), limit(3))
            }
            const result = await getDocs(q)
            setLastPage(result.docs[result.docs.length-1])

            const data = result.docs.map(doc => ({...doc.data(), id: doc.id}))
            if (result.empty) {
                dataEmpty?.call();
            }
            setData(data)
            
            setStatus('fetched');
        }

        fetch()
    }

    return { status, data, fetchData }
}

export default useFetchFbCollection