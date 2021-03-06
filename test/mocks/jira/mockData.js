const mockData = {
    boardId: {
        values: [
            {
                id: 987,
                name: "Lorem Ipsum board",
            },
        ],
    },
    boardConfig: {
        id: 987,
        name: "Lorem Ipsum board",
        location: {
            key: "PROJ",
        },
        columnConfig: {
            columns: [
                {
                    name: "Sprint Backlog",
                    statuses: [
                        {
                            id: "1",
                        },
                    ],
                },
                {
                    name: "In Progress",
                    statuses: [
                        {
                            id: "2",
                        },
                    ],
                },
                {
                    name: "Done",
                    statuses: [
                        {
                            id: "3",
                        },
                        {
                            id: "4",
                        },
                    ],
                },
            ],
        },
    },
    cardDetails: {
        todo: {
            key: "GRZ-1",
            fields: {
                // This is the field's name in JIRA, I can't change it
                // eslint-disable-next-line
                customfield_10005: 3,
                summary: "The future is coming on",
                description: "I ain't happy, I'm feeling glad, I got sunshine in a bag",
                assignee: {
                    name: "clint.eastwood",
                },
                priority: {
                    name: "Prio3 - Medium",
                },
                status: {
                    name: "To Do",
                },
            },
        },
        inProgress: {
            key: "GRZ-2",
            fields: {
                // This is the field's name in JIRA, I can't change it
                // eslint-disable-next-line
                customfield_10005: 1,
                summary: "19-2000",
                description: "The world is spinning too fast, I'm buying lead Nike shoes",
                assignee: {
                    name: "monkey.jungle",
                },
                priority: {
                    name: "Prio3 - Medium",
                },
                status: {
                    name: "In Progress",
                },
            },
        },
        done: {
            key: "GRZ-3",
            fields: {
                // This is the field's name in JIRA, I can't change it
                // eslint-disable-next-line
                customfield_10005: 2,
                summary: "Melancholy Hill",
                description: "If you can't get what you want then you come with me",
                assignee: {
                    name: "clint.eastwood",
                },
                priority: {
                    name: "Prio3 - Medium",
                },
                status: {
                    name: "Done",
                },
            },
        },
        done2: {
            key: "GRZ-4",
            fields: {
                // This is the field's name in JIRA, I can't change it
                // eslint-disable-next-line
                customfield_10005: 2,
                summary: "Sorcererz",
                description: "Everybody hold on to your inner visions",
                assignee: {
                    name: "hold.on",
                },
                priority: {
                    name: "Prio3 - Medium",
                },
                status: {
                    name: "Done",
                },
            },
        },
        wontFix: {
            key: "GRZ-5",
            fields: {
                // This is the field's name in JIRA, I can't change it
                // eslint-disable-next-line
                customfield_10005: 5,
                summary: "Humility",
                description: "Calling the world from isolation 'cause right now, that's the ball where we be chained",
                priority: {
                    name: "Prio3 - Medium",
                },
                status: {
                    name: "Won't Fix",
                },
            },
        },
        snoopDogg: {
            key: "ASSIGNSNOOPDOGG-123",
            fields: {
                // This is the field's name in JIRA, I can't change it
                // eslint-disable-next-line
                customfield_10005: 1,
                summary: "Snoop Dogg",
                description: "Welcome to the World of the Plastic Beach",
                assignee: {
                    name: "snoop.dogg",
                },
                priority: {
                    name: "Prio3 - Medium",
                },
                status: {
                    name: "Done",
                },
            },
        },
        unassign: {
            key: "UNASSIGN-123",
            fields: {
                // This is the field's name in JIRA, I can't change it
                // eslint-disable-next-line
                customfield_10005: 1,
                summary: "Assigned to no one",
                description: "All the lonely people - where do they all belong?",
                priority: {
                    name: "Prio3 - Medium",
                },
                status: {
                    name: "Done",
                },
            },
        },
    },
    searchForOneCardTransitions: {
        issues: [
            {
                transitions: [
                    {
                        to: {
                            name: "To Do",
                            id: "1",
                        },
                    },
                    {
                        to: {
                            name: "In Progress",
                            id: "2",
                        },
                    },
                    {
                        to: {
                            name: "Done",
                            id: "3",
                        },
                    },
                    {
                        to: {
                            name: "Won't Fix",
                            id: "4",
                        },
                    },
                ],
            },
        ],
    },
    activeCardsTransitions: {
        transitions: [
            {
                name: "To Do",
                id: "1",
            },
            {
                name: "In Progress",
                id: "2",
            },
            {
                name: "Done",
                id: "3",
            },
            {
                name: "Won't Fix",
                id: "4",
            },
        ],
    },
    github: {
        noPR: {
            detail: [
                {
                    pullRequests: [],
                },
            ],
        },
        onePR: {
            detail: [
                {
                    pullRequests: [
                        {
                            url: "https://github.com/endreymarca/jiraf/pull/100",
                        },
                    ],
                },
            ],
        },
        morePRs: {
            detail: [
                {
                    pullRequests: [
                        {
                            url: "https://github.com/endreymarca/jiraf/pull/100",
                        },
                        {
                            url: "https://github.com/endreymarca/jiraf/pull/200",
                        },
                        {
                            url: "https://github.com/endreymarca/jiraf/pull/300",
                        },
                    ],
                },
            ],
        },
    },
};

mockData.cardsOnBoard = {
    issues: [
        mockData.cardDetails.todo,
        mockData.cardDetails.inProgress,
        mockData.cardDetails.done2,
        mockData.cardDetails.done,
        mockData.cardDetails.wontFix,
    ],
};

module.exports = mockData;
