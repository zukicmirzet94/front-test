type PlanetField = 'planetName' | 'description' | 'imageUrl' | 'planetColor' | 'planetRadiusKM' | 'distInMillionsKM' | 'distInMillionsKM';

export interface TableColumn {
    field: PlanetField;
    display: string;
}

export interface PlanetWithFile extends Planet {
    file?: File;
}

export interface Planet {
    id?: number;
    planetName: string;
    planetColor: string;
    planetRadiusKM: number;
    distInMillionsKM: PlanetDistance;
    description: string;
    imageUrl?: string;
    imageName?: string;
}

export interface PlanetDistance {
    fromSun: number;
    fromEarth: number;
}