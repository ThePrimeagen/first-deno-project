export type RatingsRequest = number[];
export type RatingsResponse = {
    [key: number]: number
}

export type Video = {
    id: number;
    title: string;
    rating: number;
}
export type List = {videos: Video[]};
export type Lolomo = {lists: List[]};

