import { useState, useEffect } from 'react';
import useFetch from 'use-http';

const INITIAL_STATE_DATA = {
    count: 0,
    next: '',
    results: [],
};

const INITIAL_STATE_PAGE = 1;

const onNewData = (currData, newData) => {
    return {
        ...newData,
        results: [...currData.results, ...newData.results],
    };
};

const useCongress = (populate = false) => {
    const [data, setData] = useState(INITIAL_STATE_DATA);
    const [searchResponse, setSearchResponse] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(INITIAL_STATE_PAGE);
    const {get, loading, error } = useFetch();

    useEffect(() => {
        fetchCongress();
    }, [page]);

    useEffect(() => {
        if (keyword.trim().length > 3) {
            fetchKeyword();
        }

        if (searchResponse && keyword.trim().length === 0) {
            setSearchResponse(null);
        }
    }, [keyword]);

    const fetchCongress = async() => {
        const response = await get(`/planets?page=${page}`);
        if (response.count) {
            if (populate) {
                setData(onNewData(data, response));
            } else {
                setData(response);
            }
        }
    };

    const fetchKeyword = async() => {
        const response = await get(`/planets?search=${keyword}`);
        if (response.count) setSearchResponse(response);
    };

    const nextPage = async() => {
        setPage(page + 1);
    };

    const prevPage = async() => {
        if (!populate && page > INITIAL_STATE_PAGE) {
            setPage(page - 1);
        }
    };

    const searchByName = (value) => {
        setKeyword(value);
    };

    return {
        data: searchResponse || data,
        loading,
        error,
        prevPage,
        nextPage,
        searchByName,
    };
};

export default useCongress;