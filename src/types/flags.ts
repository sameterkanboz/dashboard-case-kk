export type Flag = {
  id: number;
  name: string;
  color: string;
  priority: number;
};

export const Flags: Flag[] = [
  {
    id: 1,
    name: "High Priority",
    color: "#C80B0B",
    priority: 1,
  },
  {
    id: 2,
    name: "Medium Priority",
    color: "#F79009",
    priority: 2,
  },
  {
    id: 3,
    name: "Low Priority",
    color: "#B3B8DB",
    priority: 3,
  },
  {
    id: 4,
    name: "Standart Priority",
    color: "#2083D7",
    priority: 4,
  },
  {
    id: 5,
    name: "Neutral Priority",
    color: "#079455",
    priority: 5,
  },
];
