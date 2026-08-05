/** Which half of the frame something occupies. Derived, never stored — see `artifactSide`. */
export type ProjectSide = "left" | "right";

export interface Project {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  features: string[];
  techStack: string[];
  github?: string;
  liveDemo?: string;
}

export const projects: Project[] = [
  {
    id: "studio-oak",
    index: 0,
    title: "Studio Oak",
    subtitle: "Premium MERN E-Commerce Platform",
    image: "/images/p2.png",
    description:
      "Full-stack e-commerce platform built for scalability and modern UX — browsing, cart management, secure auth, order placement, and checkout through a clean, responsive interface with efficient state management on top of a clean backend architecture.",
    features: [
      "JWT auth",
      "role-based authorization",
      "product catalog",
      "category filtering",
      "shopping cart",
      "wishlist",
      "checkout workflow",
      "order management",
      "responsive UI",
      "REST APIs",
      "admin dashboard",
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS"],  },
  {
    id: "rate-limiter",
    index: 1,
    title: "Distributed API Rate Limiter",
    subtitle: "Spring Boot + Redis",
    image: "/images/p3.png",
    description:
      "Production-ready distributed rate limiter protecting backend services from abuse, bot traffic, and DDoS-style bursts. Supports multiple interchangeable strategies via the Strategy pattern, sharing request counters through Redis so limits hold across distributed deployments.",
    features: [
      "Token Bucket",
      "Sliding Window",
      "Fixed Window",
      "Redis distributed counters",
      "Strategy Design Pattern",
      "low latency",
      "configurable limits",
      "production-grade architecture",
    ],
    techStack: ["Java", "Spring Boot", "Redis", "Docker", "REST API"],  },
  {
    id: "credit-risk",
    index: 2,
    title: "Alternate Credit Risk Score",
    subtitle: "Machine Learning for Financial Inclusion",
    image: "/images/p4.png",
    description:
      "ML system evaluating creditworthiness for individuals with little or no traditional banking history, using alternative financial indicators. Includes feature engineering, multiple trained models, and SHAP-based explainability so predictions stay transparent for lending decisions.",
    features: [
      "feature engineering",
      "XGBoost model",
      "explainable AI",
      "SHAP visualization",
      "credit prediction",
      "data preprocessing",
      "model evaluation",
      "financial inclusion focus",
    ],
    techStack: ["Python", "XGBoost", "Scikit-learn", "Pandas", "NumPy", "SHAP", "Matplotlib"],  },
  {
    id: "physiocheck",
    index: 3,
    title: "PhysioCheck",
    subtitle: "AI-Based Physiotherapy Assistant",
    image: "/images/p5.png",
    description:
      "Computer-vision rehab assistant that tracks body posture in real time, compares joint angles against target parameters, flags incorrect movement, and gives immediate corrective feedback during exercises.",
    features: [
      "pose detection",
      "exercise validation",
      "joint angle measurement",
      "real-time feedback",
      "OpenCV pipeline",
      "progress tracking",
      "rehabilitation assistance",
    ],
    techStack: ["Python", "OpenCV", "MediaPipe", "Machine Learning", "Computer Vision"],  },
  {
    id: "orbe",
    index: 4,
    title: "ORBE",
    subtitle: "Graph-Based Stock Market Intelligence",
    image: "/images/p6.png",
    description:
      "Stock market analysis system modeling financial relationships as a graph rather than isolated data points — companies as interconnected nodes — so users can analyze dependencies, sector influence, and investment paths with graph algorithms.",
    features: [
      "graph-based market model",
      "network visualization",
      "company relationships",
      "sector analysis",
      "market influence mapping",
      "graph algorithms",
    ],
    techStack: ["Python", "NetworkX", "Graph Theory", "React", "Data Visualization"],  },
  {
    id: "ngo-connect",
    index: 5,
    title: "NGO Connect",
    subtitle: "Volunteer & Event Management Platform",
    image: "/images/p7.png",
    description:
      "Platform connecting NGOs with volunteers — organizations publish events and campaigns, volunteers browse and register — through a simple, responsive interface for participating in social initiatives.",
    features: [
      "volunteer registration",
      "NGO dashboard",
      "event creation",
      "event participation",
      "authentication",
      "responsive design",
      "user management",
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "JWT"],  },
  {
    id: "binary-tree-visualizer",
    index: 6,
    title: "Binary Tree Visualizer",
    subtitle: "Interactive Data Structure Learning Tool",
    image: "/images/p8.png",
    description:
      "Educational app for understanding binary trees through real-time visualization — insert, delete, search, and traverse nodes while watching animated tree transformations that make the underlying algorithms legible.",
    features: [
      "insert node",
      "delete node",
      "search node",
      "inorder / preorder / postorder traversal",
      "tree balancing visualization",
      "interactive animations",
    ],
    techStack: ["JavaScript", "React", "D3.js", "Algorithms"],  },
];
