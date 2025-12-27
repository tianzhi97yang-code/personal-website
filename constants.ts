
import { BlogPost, Conference, EducationItem, Language, MemePost, Publication, UserProfile } from './types';

export const TRANSLATIONS = {
  [Language.EN]: {
    enter: "Enter My World",
    catalog: "Catalog",
    menu: {
      home: "Home / Mood",
      cv: "Curriculum Vitae",
      publications: "Publications",
      conferences: "Conferences",
      blog: "Blog / Thoughts",
    },
    blog: {
      categories: {
        all: 'All',
        research: 'Research',
        essays: 'Essays',
        trash: 'Trash Talk'
      },
      readMore: "Read More",
      comments: "Visitor Messages",
      leaveComment: "Leave a Note",
      namePlaceholder: "Your Nickname",
      commentPlaceholder: "Say something nice...",
      submit: "Post Note",
      uploadImage: "Attach Image",
      newPost: "Write New Post",
      save: "Publish",
      cancel: "Cancel",
    },
    theme: {
      dark: "Night Mode",
      light: "Day Mode",
    },
    misc: {
      contact: "Contact",
      downloadCv: "Download CV (PDF)",
      adminLogin: "Owner Login",
      logout: "Logout",
      edit: "Edit",
      delete: "Delete",
      add: "Add New",
      save: "Save"
    }
  },
  [Language.ZH]: {
    enter: "进入我的世界",
    catalog: "目录",
    menu: {
      home: "主页 / 心情",
      cv: "简历 (CV)",
      publications: "发表论文",
      conferences: "会议与讲座",
      blog: "博客 / 随笔",
    },
    blog: {
      categories: {
        all: '全部',
        research: '研究',
        essays: '随笔',
        trash: '垃圾话'
      },
      readMore: "阅读全文",
      comments: "访客留言",
      leaveComment: "留个言吧",
      namePlaceholder: "你的昵称",
      commentPlaceholder: "写点什么...",
      submit: "发送",
      uploadImage: "附图",
      newPost: "写新文章",
      save: "发布",
      cancel: "取消",
    },
    theme: {
      dark: "夜间模式",
      light: "日间模式",
    },
    misc: {
      contact: "联系方式",
      downloadCv: "下载简历 (PDF)",
      adminLogin: "站长登录",
      logout: "登出",
      edit: "编辑",
      delete: "删除",
      add: "添加",
      save: "保存"
    }
  }
};

export const DEFAULT_PROFILE: UserProfile = {
  name: "Tianzhi Yang",
  title: "PhD in Relaxation & Aesthetics",
  affiliation: "University of Comfort, Department of Naps",
  motto: "Stay academic, stay cozy.",
  coverTitle: "My Little Secrets",
  nameZh: "杨天智",
  titleZh: "放松与美学博士",
  affiliationZh: "舒适大学，午睡系",
  mottoZh: "保持学术，保持惬意。",
  coverTitleZh: "我的小秘密",
  avatarUrl: "https://picsum.photos/id/64/400/400",
  bio: "Welcome to my personal space. I research the intersection of comfort, aesthetics, and academic life. When I'm not writing papers, I'm probably napping or drinking tea.",
  cvPdfUrl: "#"
};

export const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: '1',
    degree: "Ph.D. in Relaxation",
    school: "University of Comfort",
    year: "2020 - 2024",
    color: "bg-rose-300"
  },
  {
    id: '2',
    degree: "B.S. in Blanket Engineering",
    school: "Institute of Soft Fabrics",
    year: "2016 - 2020",
    color: "bg-rose-200"
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: '1',
    title: "On the Softness of Blankets: A Quantitative Analysis",
    authors: "Me, My Cat, et al.",
    venue: "Journal of Cozy Studies",
    year: 2024,
  },
  {
    id: '2',
    title: "Optimizing Tea Temperature for Maximum Relaxation",
    authors: "Me, A. Teapot",
    venue: "International Conference on Leisure",
    year: 2023,
  },
  {
    id: '3',
    title: "Machine Learning Approaches to Predicting Rainy Afternoons",
    authors: "Me, The Cloud",
    venue: "Nature Climate & Vibes",
    year: 2022,
  }
];

export const CONFERENCES: Conference[] = [
  {
    id: '1',
    title: "Keynote: Why Naps are Essential",
    event: "Global Sleep Summit",
    date: "Oct 2024",
    location: "Dreamland, Remote"
  },
  {
    id: '2',
    title: "Poster: Cute Animals as Stress Relievers",
    event: "Psychology of Fluff",
    date: "June 2024",
    location: "London, UK"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "The Art of Doing Nothing",
    category: "Lifestyle",
    date: "2024-05-10",
    excerpt: "Sometimes the most productive thing to do is absolutely nothing at all.",
    content: "In a world that constantly demands our attention, taking a step back to simply exist is a revolutionary act. Yesterday, I spent three hours watching dust motes dance in a sunbeam. It was profound. The academic pressure often makes us forget that we are human beings, not human doings. \n\nHere is a picture of my workspace today.",
    tags: ["relax", "academic-life"],
    image: "https://picsum.photos/id/100/800/400"
  },
  {
    id: '2',
    title: "Research Updates: Spring 2024",
    category: "Academic",
    date: "2024-04-22",
    excerpt: "A quick summary of what I've been working on in the lab.",
    content: "We finally managed to isolate the variable causing the noise in our dataset. It turns out, someone was humming too loudly near the sensors. Science is weird like that. I'm preparing for the upcoming conference season and feeling a mix of excitement and dread.",
    tags: ["research", "update"],
  },
  {
    id: '3',
    title: "My Favorite Coffee Shops",
    category: "Hobby",
    date: "2024-03-15",
    excerpt: "Where to find the best latte in town.",
    content: "If you are looking for a place with good wifi, soft jazz, and questionable latte art, look no further. I've compiled a list...",
    tags: ["coffee", "city-guide"],
  }
];

export const MEMES: MemePost[] = [
  {
    id: '1',
    title: "Current Mood",
    imageUrl: "https://picsum.photos/id/237/500/500", // Dog
    caption: "When the reviewer asks for 'minor revisions' but sends 5 pages of comments."
  },
  {
    id: '2',
    title: "Deadline Season",
    imageUrl: "https://picsum.photos/id/1025/500/600", // Pug in blanket
    caption: "Me trying to hide from my responsibilities."
  },
  {
    id: '3',
    title: "Lab Life",
    imageUrl: "https://picsum.photos/id/1062/500/500", // Dog wrapped up
    caption: "Is it Friday yet?"
  },
  {
    id: '4',
    title: "Motivation",
    imageUrl: "https://picsum.photos/id/40/500/700", // Cat
    caption: "Just hang in there."
  }
];
