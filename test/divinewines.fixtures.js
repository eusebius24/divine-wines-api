function makeRecordsArray () {
    return [
        {
            id: 1,
            name: 'First test record',
            vintner: null,
            varietal: null,
            region: null,
            year: null,
            region: 'Test region',
            tasting_notes: null,
            rating: null
        },
        {
            id: 2,
            name: 'Second test record',
            vintner: '',
            varietal: '',
            region: '',
            year: null,
            region: 'Test region',
            tasting_notes: '',
            rating: null
        },
        {
            id: 3,
            name: 'Third test record',
            vintner: null,
            varietal: null,
            region: null,
            year: null,
            region: 'Test region',
            tasting_notes: null,
            rating: null
        },
        {
            id: 4,
            name: 'Fourth test record',
            vintner: null,
            varietal: null,
            region: null,
            year: null,
            region: 'Test region',
            tasting_notes: null,
            rating: null
        },
    ];
}

module.exports = {
    makeRecordsArray,
}