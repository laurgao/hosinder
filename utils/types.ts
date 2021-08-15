export interface UserObj {
    email: string,
    name: string,
    image: string,
    grade: number,
    school: string,
    labels?: string[],
    previousEvents?: string[],
    preferredEvents?: string[],
    notWantedEvents?: string[],
}

export interface EventObj {
    name: string; 
    description: string; 
    labels?: string[]; // "individual" | "team" | ...
    image?: string; 
}

export interface SchoolObj {
    name: string; 
    admin: string[]; 
    description?: string; 
}

export interface SessionObj {
    user: {
        name: string,
        email: string,
        image: string,
    },
    userId: string,
    username: string,
}

// generic / type alias from https://stackoverflow.com/questions/26652179/extending-interface-with-generic-in-typescript
export type DatedObj<T extends {}> = T & {
    _id: string,
    createdAt: string, // ISO date
    updatedAt: string, // ISO date
}

export type IdObj<T extends {}> = T & {
    _id: string,
}