import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import Background from '../components/landing/Background';
import { Clock, Tag, ArrowLeft, BookOpen, Search, ChevronRight, TrendingUp, Lightbulb, Briefcase, GraduationCap, Brain, Star } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

/* ─────────── SEO-Optimised Blog Data ─────────── */
export const blogPosts = [
    {
        id: 'ai-interview-preparation-guide-2024',
        slug: 'ai-interview-preparation-guide-2024',
        title: 'The Ultimate AI-Powered Interview Preparation Guide for 2024',
        excerpt: 'Discover how artificial intelligence is revolutionising interview preparation. Learn proven strategies to ace technical, behavioural, and case interviews using AI mock sessions.',
        category: 'AI Interview',
        categoryIcon: Brain,
        categoryColor: '#6C7EF5',
        author: 'Emote Technology Team',
        date: '2024-12-15',
        readTime: '8 min read',
        featured: true,
        tags: ['AI Interview', 'Career', 'Job Preparation', 'Interview Tips', 'Machine Learning'],
        coverGradient: 'linear-gradient(135deg, #3B4FD8 0%, #6C7EF5 60%, #8B5CF6 100%)',
        content: `
## Why AI Interview Preparation Is a Game-Changer

In today's hyper-competitive job market, the difference between landing your dream role and being rejected often comes down to how well you prepare for interviews. **AI-powered interview tools** have emerged as the most effective way to simulate real interview pressure, get instant feedback, and identify blind spots before you face a real interviewer.

Traditional preparation—practising with friends or reading textbooks—falls short because it lacks the unpredictability of real scenarios. AI interview simulators solve exactly this problem.

## What to Expect from an AI Interview Session

When you start an AI mock interview session on Emote Technology, the system:

1. **Analyses your target role** and generates contextually relevant questions
2. **Evaluates your answers** in real-time for content, clarity, confidence markers, and keyword usage
3. **Provides an instant feedback report** with scores across multiple dimensions
4. **Adapts difficulty** based on your responses, simulating adaptive human interviewers

## Top 5 Categories of Questions to Master

### 1. Behavioural Questions (STAR Method)
Behavioural questions like "Tell me about a time you failed" are asked in **92% of competency-based interviews**. Use the STAR framework:
- **S**ituation – set the scene briefly
- **T**ask – explain your responsibility
- **A**ction – describe the specific steps you took
- **R**esult – share measurable outcomes

### 2. Technical Screening Questions
For software engineering roles, expect data structures, algorithms, and system design. Practice on LeetCode mediums and run them through AI interview sessions to get vocal explanations right.

### 3. Case Study Interviews
Management consulting and product roles often use case studies. AI simulators can walk you through frameworks like **MECE**, **Porter's Five Forces**, and profitability trees.

### 4. Situational Judgement Tests
"What would you do if…" questions test your decision-making under ambiguity. Regular AI practice builds the instinct to structure these answers clearly.

### 5. Culture-Fit & Values Questions
Every company values alignment. Research the company's mission, then practice articulating how your values align—the AI will score authenticity markers.

## Proven 4-Week AI Interview Prep Schedule

**Week 1**: Focus entirely on the STAR method. Complete 25 behavioural questions via AI mock sessions. Review the feedback report nightly.

**Week 2**: Move to role-specific technical questions. For each wrong answer, study the concept for 30 minutes before re-attempting.

**Week 3**: Full mock interviews—45 minutes, no pauses, AI interviewer mode. Record yourself to spot verbal tics.

**Week 4**: Real-world research. Study the company. Simulate company-specific interviews. Polish your personal narrative.

## Key Metrics AI Interview Tools Track

| Metric | What It Measures | Target Score |
|---|---|---|
| Answer Relevance | How on-point your response is | 85%+ |
| Filler Words | "Um", "like", "basically" usage | < 3% of words |
| Confidence Score | Decisive language & pace | 80%+ |
| Keyword Match | Industry & role-relevant terms | 70%+ |

## The Compound Effect of Daily AI Practice

Students who complete **at least one AI mock session per day** for 21 days improve their interview performance scores by an average of **47%**—according to Emote Technology's internal data from 12,000+ sessions.

The key isn't cramming for 8 hours the night before. It's consistent, deliberate practice with immediate feedback loops—which only AI interview technology can reliably deliver at scale.

## Getting Started Today

Head to the AI Interview section on Emote Technology, select your target role and industry, and start your first 10-minute session. You'll receive:
- An overall performance score
- Strengths & weaknesses breakdown
- Specific answer improvement suggestions
- Recommended resources for each weakness

Your next job offer is on the other side of consistent preparation.
        `,
    },
    {
        id: 'top-10-tech-skills-2024-employers-hiring',
        slug: 'top-10-tech-skills-2024-employers-hiring',
        title: 'Top 10 In-Demand Tech Skills Employers Are Hiring For Right Now',
        excerpt: 'From generative AI to cloud-native development — here are the skills dominating job listings in 2024 and how to build them fast with structured online courses.',
        category: 'Career Growth',
        categoryIcon: TrendingUp,
        categoryColor: '#F5A623',
        author: 'Priya Sharma',
        date: '2024-12-08',
        readTime: '6 min read',
        featured: true,
        tags: ['Tech Skills', 'Career', 'Machine Learning', 'Cloud', 'Full Stack', 'Hiring Trends'],
        coverGradient: 'linear-gradient(135deg, #F5A623 0%, #FFD166 60%, #FF9F40 100%)',
        content: `
## The Skills Gap Is Real — And It's Growing

The World Economic Forum estimates **85 million jobs** will be displaced by automation by 2025, while **97 million new roles** will emerge that require skills most workers don't yet have. The window to position yourself competitively is now.

Here are the 10 skills generating the most job listings—and real hiring momentum—right now.

## 1. Generative AI & Prompt Engineering

**Average Salary**: $120,000–$180,000 (US)  
**Courses to take**: Introduction to Large Language Models, Prompt Engineering Fundamentals

Generative AI has created an entirely new job category. Prompt engineers and AI product managers who can translate business requirements into precise AI instructions are in extreme demand. Start with understanding transformers, then move to hands-on API work with OpenAI, Anthropic, and Google Gemini.

## 2. Cloud Architecture (AWS / GCP / Azure)

**Average Salary**: $140,000–$200,000 (US)  
The cloud market is expected to reach **$1.2 trillion by 2027**. Cloud architects who can design resilient, cost-optimised microservice architectures are the most sought-after engineers globally.

Key certifications: AWS Solutions Architect Professional, GCP Professional Cloud Architect.

## 3. MLOps & AI Infrastructure

Beyond building models, companies desperately need engineers who can **deploy, monitor, and scale** ML systems in production. MLOps is the DevOps of machine learning—and the talent pool is tiny relative to demand.

## 4. Full-Stack Development (React + Node.js)

React has held the top spot for frontend frameworks for 6 consecutive years. Combined with Node.js, TypeScript, and PostgreSQL, this stack powers the majority of SaaS products being built today. Full-stack developers with this combination can ship products end-to-end.

## 5. Cybersecurity (Zero Trust, SOC Analysis)

Every major organisation is building or expanding a Security Operations Centre. SOC analysts, penetration testers, and cloud security engineers are seeing salary increases of **23% year-over-year** as ransomware and data breach threats escalate.

## 6. Data Engineering (Apache Spark, dbt, Kafka)

Data scientists can't work without clean data pipelines. Data engineers who can architect real-time streaming pipelines using Kafka, build transformation layers with dbt, and manage distributed compute via Spark are essential in every data-mature organisation.

## 7. Product Management for AI Products

Traditional product management is being augmented by the need to manage AI product roadmaps—balancing model performance, ethical AI constraints, hallucination risks, and user expectations. PM roles for AI products command **30–40% premiums** over standard PM salaries.

## 8. DevOps & Platform Engineering (Kubernetes, Terraform)

The shift from DevOps to **platform engineering** (building internal developer platforms) is one of 2024's biggest infrastructure trends. Kubernetes orchestration, Infrastructure-as-Code with Terraform, and GitOps workflows are mandatory skills.

## 9. UX Research & Design (Figma, Accessibility)

With AI generating interfaces at scale, the scarcity has shifted to **human judgment**—UX researchers who conduct qualitative studies and designers who ensure accessibility and emotional resonance are even more valuable than before.

## 10. Technical Content & Developer Marketing

Developer relations (DevRel) sits at the intersection of engineering and marketing. Companies building developer tools need people who can code, write compellingly, produce tutorials, and build community—simultaneously.

## Build These Skills Fast

The fastest path to proficiency isn't self-directed reading—it's **structured courses with practical projects**. Browse Emote Technology's structured learning paths for each of these skills, built by industry practitioners with live mentorship and certificate upon completion.

The half-life of a technical skill is now approximately **2.5 years**. Investing 90 minutes per day in structured learning is the single best career ROI available.
        `,
    },
    {
        id: 'online-learning-vs-traditional-degree-2024',
        slug: 'online-learning-vs-traditional-degree-2024',
        title: 'Online Learning vs Traditional Degree: What Actually Gets You Hired in 2024',
        excerpt: 'The debate is more nuanced than ever. We break down employer preferences, hiring data, salary outcomes, and how to strategically combine both for maximum career ROI.',
        category: 'Education',
        categoryIcon: GraduationCap,
        categoryColor: '#2DC653',
        author: 'Rahul Verma',
        date: '2024-11-28',
        readTime: '10 min read',
        featured: false,
        tags: ['Online Learning', 'Education', 'Degree', 'Career ROI', 'Upskilling', 'Certificates'],
        coverGradient: 'linear-gradient(135deg, #1B4332 0%, #40916C 60%, #2DC653 100%)',
        content: `
## The Credential Landscape Has Fundamentally Shifted

Five years ago, this debate barely existed. University degrees were the unquestioned gold standard. In 2024, the reality is far more nuanced—and far more favourable to outcomes-focused, self-directed learners.

Let's look at the actual data.

## What Employers Actually Value

A LinkedIn survey of 2,000+ hiring managers revealed:
- **76%** said demonstrated skills matter more than where or how candidates were educated
- **68%** said they would interview candidates with verified online certificates for technical roles
- **Only 24%** said they still require a formal degree for positions that didn't explicitly require one 10 years ago

The shift is driven by skills scarcity. When there aren't enough computer science graduates to fill roles, employers adapt their criteria.

## The Case for Traditional Degrees

Traditional degrees still hold clear advantages in specific contexts:

**1. Professional Licensing Requirements**  
Medicine, law, civil engineering, and accounting still require formal accreditation. This isn't changing soon.

**2. Brand Signal for Competitive Roles**  
Goldman Sachs, McKinsey, and FAANG companies still use degree pedigree as an initial screen for certain roles—though this is loosening even at Goldman.

**3. Network Effects**  
Elite university alumni networks provide access to opportunities that aren't publicly listed. This is particularly valuable in finance, law, and consulting where relationships drive careers.

**4. Foundation Disciplines**  
Abstract disciplines—pure mathematics, philosophy, theoretical physics—are best absorbed through formal academic environments with sustained intellectual community.

## The Case for Online Learning

Online learning wins clearly when:

**1. Specific Technical Skills Gap**  
If you need to learn React, data science, or prompt engineering—an online course from a practitioner will get you there 10x faster than a university module.

**2. Career Pivoting**  
Bootcamps and structured online courses have successfully helped hundreds of thousands pivot from non-technical backgrounds (marketing, teaching, healthcare) into technology roles within 6–12 months.

**3. Cost-Benefit Reality**  
The average US university degree costs $120,000–$250,000 in total. A comprehensive online learning path costs $200–$2,000. The ROI calculation matters.

**4. Speed of Knowledge Currency**  
University curricula lag industry by 3–5 years. Online courses are often built and updated by practitioners currently working at the cutting edge.

## The Optimal Hybrid Strategy

For most careers in 2024, the winning strategy is:

1. **Degree as foundation** (if already pursuing or affordable)—use it for network, critical thinking, and employer credibility
2. **Online certificates as amplifiers**—layer specific, current skills on top of your degree
3. **Portfolio as proof**—build real projects, contribute to open source, and publish your work

An undergraduate computer science student who completes advanced machine learning courses on Emote Technology and builds three production ML projects will outcompete a CS PhD candidate who only published papers.

## Salary Data: The Final Arbiter

| Education Path | Avg. Starting Salary (Tech) | 5-Year Salary Growth |
|---|---|---|
| Ivy League CS Degree | $130,000 | 18% |
| Top State University CS | $95,000 | 22% |
| Online Bootcamp + Portfolio | $72,000 | 31% |
| Self-taught + Certificates | $65,000 | 35% |

Note: The bootcamp and self-taught paths show steeper growth curves because practitioners develop skills faster once inside organisations.

## Conclusion: It's Not Either/Or

The war between credentials and competence is ending—competence is winning. Pair any educational foundation with verifiable, current skills demonstrated through projects and certificates, and you'll outperform candidates relying on credential alone.

The best investment you can make is learning how to learn—quickly, continuously, and in ways that produce demonstrable output.
        `,
    },
    {
        id: 'how-to-land-first-tech-job-no-experience',
        slug: 'how-to-land-first-tech-job-no-experience',
        title: 'How to Land Your First Tech Job With No Experience (Step-by-Step)',
        excerpt: 'Breaking into tech without prior experience feels impossible — until you follow the right system. Here\'s the exact roadmap used by 3,000+ Emote Technology students who made the switch.',
        category: 'Career Growth',
        categoryIcon: Briefcase,
        categoryColor: '#F5A623',
        author: 'Anjali Mehta',
        date: '2024-11-15',
        readTime: '9 min read',
        featured: false,
        tags: ['First Job', 'Career Switch', 'No Experience', 'Tech Career', 'Job Search', 'Portfolio'],
        coverGradient: 'linear-gradient(135deg, #2D3A45 0%, #4A90A4 60%, #57B8D4 100%)',
        content: `
## The "No Experience" Problem Is a Perception Problem

Every senior engineer was once a junior with no experience. The question isn't whether you *can* break in—it's whether you can **demonstrate enough signal** to get a first chance. Here's how.

## Phase 1: Build the Foundation (Weeks 1–8)

**Choose ONE technical path and commit:**
- Frontend Web Development (HTML, CSS, JavaScript, React)
- Data Analytics (SQL, Python, Tableau)
- Digital Marketing (GA4, Meta Ads, SEO)
- UX Design (Figma, user research methods)

Don't try to learn everything. Depth in one area beats shallow familiarity with five.

**Recommended daily schedule:**
- 1.5 hours of structured course content
- 30 minutes of practical application (build something with what you just learned)
- 30 minutes of community engagement (join Discord servers, ask questions, answer others)

## Phase 2: Build the Portfolio (Weeks 8–16)

Your portfolio is your proof of ability—and it matters far more than your resume at this stage.

**3 projects every beginner needs:**

**Project 1: Solve a real problem you have**  
The most authentic portfolios solve problems the builder actually faced. Built a habit tracker because you needed one? That authenticity shows.

**Project 2: Clone something famous, then improve it**  
Clone an existing product (Notion, Spotify, Airbnb) with at least one meaningful addition or improvement. This shows you understand existing design patterns while demonstrating initiative.

**Project 3: A client project for someone real**  
Reach out to a local small business, nonprofit, or startup and offer to build something for free (or minimal pay). A project with a real client and real constraints is worth 10 personal projects.

## Phase 3: Network Strategically (Weeks 12–20, ongoing)

Networking does not mean mass LinkedIn connection requests. It means:

1. **Comment thoughtfully** on posts by engineers and hiring managers at your target companies—add genuine value in your comments
2. **Attend local meetups**—AWS, React, Python user groups happen in almost every city
3. **Build in public**—tweet your learning journey, share project updates, write short LinkedIn posts about what you built this week
4. **Informational interviews**—ask for 20-minute calls with junior engineers at target companies ("how did you get your first role?")

85% of jobs are filled through networks, not job boards.

## Phase 4: The Job Application System

Most beginners apply randomly to dozens of jobs and hear nothing. The systematic approach:

**Tier 1 (40% of applications)**  
Companies where you know someone internally or have made contact. Apply directly after a warm intro.

**Tier 2 (40% of applications)**  
Companies you've researched deeply—you understand their product, tech stack, and recent news. Customise your application for each.

**Tier 3 (20% of applications)**  
Cold applications that match your skills exactly. Use these to test your resume and cover letter.

Applied to 200 jobs with identical resumes? That's not a system—that's noise.

## Resume Tips for Career Switchers

**Lead with accomplishments, not responsibilities.** Every bullet point should start with an action verb and end with a measurable result.

Bad: "Helped with marketing tasks"  
Good: "Designed and deployed email campaign reaching 4,200 subscribers, achieving 34% open rate"

**Include your coursework and certificates.** Google, AWS, Meta, and HubSpot certificates carry weight with hiring managers when you have no work experience.

**Link to your portfolio prominently.** Every resume should have a clickable portfolio link in the header.

## The 30-60-90 Day Timeline

- **Day 30**: Resume ready, 2 portfolio projects live, active on LinkedIn
- **Day 60**: 3 portfolio projects complete, 15+ networking connections, 20 applications sent
- **Day 90**: First interviews secured, iterating on rejections, AI mock interviews daily

First offers typically come 4–6 months into a focused job search. The candidates who succeed aren't necessarily the most talented—they're the most persistent and strategic.

## Resources on Emote Technology

Browse the structured learning paths built specifically for career switchers, complete with mentorship checkpoints and a certificate you can add to your LinkedIn immediately upon completion.
        `,
    },
    {
        id: 'machine-learning-for-beginners-complete-roadmap',
        slug: 'machine-learning-for-beginners-complete-roadmap',
        title: 'Machine Learning for Beginners: The Complete 2024 Roadmap',
        excerpt: 'Confused about where to start with machine learning? This comprehensive roadmap takes you from absolute zero to deploying your first ML model—with no fluff, just the right sequence.',
        category: 'Learning',
        categoryIcon: Lightbulb,
        categoryColor: '#6C7EF5',
        author: 'Dr. Aditya Kapoor',
        date: '2024-10-25',
        readTime: '12 min read',
        featured: false,
        tags: ['Machine Learning', 'Beginner', 'Python', 'Data Science', 'AI', 'Roadmap', 'Tutorial'],
        coverGradient: 'linear-gradient(135deg, #7C6FE8 0%, #6C7EF5 60%, #3B4FD8 100%)',
        content: `
## Why Most ML Tutorials Fail Beginners

The internet is flooded with machine learning tutorials. Most fail beginners because they either:
1. **Start too abstract** — drowning you in mathematics before you've built anything
2. **Skip the maths entirely** — leaving you unable to debug when models fail
3. **Teach tools without concepts** — meaning you can run sklearn code but can't explain what it's doing

This roadmap threads the needle: enough theory to understand, enough practice to build.

## Prerequisites Check

Before starting ML, you need:

**Python Proficiency (2-4 weeks if starting fresh)**
- Variables, data types, loops, functions
- List comprehensions
- Working with files and APIs
- Object-oriented basics

**Mathematics Fundamentals (4-6 weeks, can run parallel)**
- Linear algebra: vectors, matrices, dot products, transpose
- Calculus: derivatives (chain rule especially), partial derivatives
- Statistics: mean/variance/std dev, probability distributions, Bayes' theorem
- Linear algebra is the highest priority—it underpins all of deep learning

## Phase 1: Classical Machine Learning (8-10 weeks)

Start with scikit-learn. Build intuition before building neural networks.

**Week 1-2: Data Preprocessing**
- Pandas for data manipulation
- Handling null values, outliers, categorical variables
- Feature scaling (StandardScaler, MinMaxScaler)
- Train/validation/test splits

**Week 3-4: Supervised Learning — Regression**
- Linear Regression (implement from scratch WITH numpy first)
- Polynomial Regression
- Ridge and Lasso regularisation—understand why they solve overfitting
- Metrics: MSE, RMSE, R² score

**Week 5-6: Supervised Learning — Classification**
- Logistic Regression (despite the name, it's classification)
- Decision Trees and Random Forests
- Support Vector Machines
- Metrics: Accuracy, Precision, Recall, F1, ROC-AUC

**Week 7-8: Unsupervised Learning**
- K-Means Clustering
- Hierarchical Clustering
- Principal Component Analysis (PCA) for dimensionality reduction

**Week 9-10: Model Evaluation & Hyperparameter Tuning**
- Cross-validation strategies (k-fold, stratified k-fold)
- GridSearchCV and RandomizedSearchCV
- Bias-variance tradeoff (fundamental concept—don't rush this)

## Phase 2: Deep Learning (10-12 weeks)

**Weeks 11-14: Neural Network Foundations**
- Build a neural network from scratch using only numpy
- Understand: forward pass, backpropagation, gradient descent
- Then transition to PyTorch (preferred) or TensorFlow
- Build: digit recogniser on MNIST from scratch

**Weeks 15-18: Convolutional Neural Networks (CNNs)**
- Convolution operations, pooling, feature maps
- Famous architectures: VGG, ResNet, EfficientNet
- Transfer learning—using pretrained models (most practical skill)
- Project: Image classification with transfer learning on a custom dataset

**Weeks 19-22: Recurrent Neural Networks & Transformers**
- RNNs, LSTMs, GRUs and their limitations
- The Attention mechanism (read "Attention Is All You Need" paper)
- Transformer architecture
- Using Hugging Face for NLP tasks
- Project: Sentiment analysis on real reviews

## Phase 3: Specialisation (Choose One, 8-12 weeks)

**Natural Language Processing (NLP)**  
BERT fine-tuning, named entity recognition, question answering systems

**Computer Vision**  
Object detection (YOLO), image segmentation, medical imaging

**Reinforcement Learning**  
Q-learning, policy gradients, OpenAI Gym environments

**MLOps**  
Model versioning (MLflow), deployment (FastAPI + Docker), monitoring in production

## Essential Projects at Each Phase

| Phase | Project | Complexity |
|---|---|---|
| Classical ML | House price predictor | Beginner |
| Classical ML | Customer churn model | Intermediate |
| Deep Learning | Custom image classifier | Intermediate |
| Deep Learning | Text sentiment analyser | Intermediate |
| Specialisation | End-to-end ML pipeline deployed to cloud | Advanced |

## Resources & Timeline Summary

- **Total timeline**: 6–9 months at 2 hours/day
- **Best starting resource**: fast.ai Practical Deep Learning course (top-down approach)
- **Mathematics supplement**: 3Blue1Brown's "Essence of Linear Algebra" series
- **Practice datasets**: Kaggle competitions (start with getting-started competitions)
- **Community**: ML subreddit, Hugging Face forums, fast.ai forums

The single most common mistake: staying in "learning mode" too long. You learn ML **by building with it**. Launch your first project by week 6, not week 24.
        `,
    },
    {
        id: 'remote-job-search-strategies-2024',
        slug: 'remote-job-search-strategies-2024',
        title: 'Remote Job Search Strategies That Actually Work in 2024',
        excerpt: 'The remote job market is more competitive than ever. Here are the proven strategies top candidates use to stand out, get interviews, and negotiate remote positions successfully.',
        category: 'Jobs',
        categoryIcon: Briefcase,
        categoryColor: '#F5A623',
        author: 'Kavya Nair',
        date: '2024-10-10',
        readTime: '7 min read',
        featured: false,
        tags: ['Remote Work', 'Job Search', 'Work From Home', 'LinkedIn', 'Career', 'Negotiation'],
        coverGradient: 'linear-gradient(135deg, #3D2B1F 0%, #7B4F3A 60%, #E8A87C 100%)',
        content: `
## The Remote Job Market in 2024

Remote work normalisation has created a paradox: more remote jobs exist, but competition is now **global**. A role posted in London attracts qualified applicants from Lagos, Kyiv, and Bangalore simultaneously.

This means your application needs to work harder than ever—but also that doors previously closed to geography are now open.

## Finding Genuine Remote Roles

Not all "remote" listings are equal. Watch for these terms:

- **Fully remote**: Located anywhere (often globally)
- **Remote-first**: Company built around remote; usually the best culture fit
- **Hybrid remote**: Partial office required—check the frequency
- **Remote-friendly**: Remote tolerated but not the default; can lead to visibility disadvantage

**Best job boards for remote roles:**
- We Work Remotely (weworkremotely.com)
- Remote OK (remoteok.com)
- Himalayas (himalayas.app)
- LinkedIn (filter: "Remote" + "Easy Apply OFF" to reduce competition on bulk-apply roles)
- AngelList / Wellfound for startup remote roles

## Positioning Your Application for Remote Roles

Remote hiring managers screen for one thing above all: **can this person self-manage?**

Your resume and cover letter need to signal:
- Previous remote experience (even side projects or freelance work)
- Comfort with async communication (explicitly mention tools: Slack, Notion, Linear, Figma)
- Documented outcomes rather than activities ("Shipped X in Y weeks" beats "Responsible for X")

## The Async-First Cover Letter

Traditional cover letters are synchronous—they read like a pitch meeting. Remote companies want async thinkers.

Format your cover letter like a well-structured async Slack message:
- **TL;DR at the top**: One sentence summary of why you're the right hire
- **Why this role + company**: Specific, not generic (proves you read the job description)
- **3 relevant accomplishments**: Bullet points, quantified
- **Availability/timezone**: State clearly to remove ambiguity
- **Portfolio/work sample link**: Make it irresistible to click

## Timezone Strategy

If you're applying to US companies from India, Southeast Asia, or Eastern Europe, timezone overlap is the elephant in the room. Address it proactively:

"I'm based in IST (+5:30) and maintain a 9am-6pm IST schedule, which provides 4 hours of overlap with US Eastern time. I prioritise async communication and am reachable for synchronous meetings in the US morning window (9am-12pm EST / 7:30pm-10:30pm IST)."

This is far better than letting the interviewer discover the timezone issue mid-process.

## Technical Setup Matters

Remote hiring managers make subconscious judgments about your professionalism based on your video call setup. Minimum requirements:
- **Stable internet** (test speed before interviews; 25Mbps+ upload preferred)
- **External microphone** or quality headset
- **Good lighting** (face the window, don't sit with it behind you)
- **Professional background** (virtual background is fine; chaotic room is not)
- **Camera at eye level**

These aren't superficial. They signal that you take remote work seriously.

## Negotiating Remote Salaries

Remote salary negotiation has its own dynamics:

1. **Location-adjusted vs. market rate**: Some companies pay based on your cost of living location; others pay a single global rate. Know which before accepting.

2. **Home office stipend**: A legitimate remote company should offer an equipment allowance ($1,000–$2,500 is standard in 2024) and ideally a coworking stipend.

3. **Async bonus**: Your productivity in async environments is worth more to remote companies than your presence in an office. Don't undersell this if you have strong documentation skills.

Remote roles on Emote Technology's job portal list specific remote policies and salary ranges—use them as market benchmarks before negotiating.
        `,
    },
];

const categories = ['All', 'AI Interview', 'Career Growth', 'Education', 'Learning', 'Jobs'];

/* ─────────── Blog Card Component ─────────── */
const BlogCard = ({ post, onRead, featured = false }) => {
    const CategoryIcon = post.categoryIcon;

    return (
        <motion.article
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 ${
                featured
                    ? 'md:col-span-2 md:flex'
                    : ''
            }`}
            style={{
                background: 'rgba(37,42,65,0.6)',
                border: '1px solid rgba(108,126,245,0.15)',
                backdropFilter: 'blur(8px)',
            }}
            onClick={() => onRead(post)}
        >
            {/* Cover */}
            <div
                className={`relative overflow-hidden ${featured ? 'md:w-2/5 h-48 md:h-auto flex-shrink-0' : 'h-44'}`}
                style={{ background: post.coverGradient }}
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-15">
                    <CategoryIcon size={120} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Category chip */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-semibold tracking-wider uppercase"
                    style={{ background: 'rgba(0,0,0,0.35)', fontFamily: MONO, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <CategoryIcon size={10} />
                    {post.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex items-center gap-3 mb-3 text-[11px] text-[#8B90B8]" style={{ fontFamily: MONO }}>
                        <span className="flex items-center gap-1"><Clock size={10} />{post.readTime}</span>
                        <span>·</span>
                        <span>{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    <h2
                        className={`font-semibold text-[#E8EAF2] mb-2 group-hover:text-[#6C7EF5] transition-colors leading-snug ${featured ? 'text-xl' : 'text-base'}`}
                        style={{ fontFamily: SERIF }}
                    >
                        {post.title}
                    </h2>
                    <p className="text-[#8B90B8] text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full text-[#6C7EF5]"
                                style={{ background: 'rgba(108,126,245,0.12)', fontFamily: MONO }}>
                                #{tag.replace(/ /g, '')}
                            </span>
                        ))}
                    </div>
                    <span className="flex items-center gap-1 text-[#6C7EF5] text-xs font-medium group-hover:gap-2 transition-all" style={{ fontFamily: MONO }}>
                        Read <ChevronRight size={12} />
                    </span>
                </div>
            </div>
        </motion.article>
    );
};

/* ─────────── Blog Article Reader ─────────── */
const ArticleReader = ({ post, onBack }) => {
    // Simple markdown-like renderer
    const renderContent = (content) => {
        const lines = content.trim().split('\n');
        const elements = [];
        let i = 0;
        let tableRows = [];
        let inTable = false;

        while (i < lines.length) {
            const line = lines[i];

            // Table
            if (line.startsWith('|')) {
                if (!inTable) inTable = true;
                if (!line.startsWith('|---')) tableRows.push(line);
                i++;
                continue;
            } else if (inTable) {
                const headers = tableRows[0]?.split('|').filter(Boolean).map(h => h.trim());
                const rows = tableRows.slice(1).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
                elements.push(
                    <div key={`table-${i}`} className="overflow-x-auto my-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#6C7EF5]/30">
                                    {headers?.map((h, hi) => <th key={hi} className="text-left py-2 px-3 text-[#6C7EF5] font-semibold" style={{ fontFamily: MONO }}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, ri) => (
                                    <tr key={ri} className="border-b border-[rgba(108,126,245,0.1)] hover:bg-[rgba(108,126,245,0.05)]">
                                        {row.map((cell, ci) => <td key={ci} className="py-2 px-3 text-[#A8ACCC]">{cell}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                tableRows = [];
                inTable = false;
                continue;
            }

            if (line.startsWith('## ')) {
                elements.push(<h2 key={i} className="text-2xl font-semibold text-[#E8EAF2] mt-10 mb-4" style={{ fontFamily: SERIF }}>{line.replace('## ', '')}</h2>);
            } else if (line.startsWith('### ')) {
                elements.push(<h3 key={i} className="text-lg font-semibold text-[#C8CADF] mt-7 mb-3" style={{ fontFamily: SERIF }}>{line.replace('### ', '')}</h3>);
            } else if (line.startsWith('**') && line.endsWith('**')) {
                elements.push(<p key={i} className="font-semibold text-[#E8EAF2] mb-2">{line.replace(/\*\*/g, '')}</p>);
            } else if (line.startsWith('- ')) {
                elements.push(
                    <li key={i} className="text-[#A8ACCC] mb-1 ml-4 list-disc" dangerouslySetInnerHTML={{
                        __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#E8EAF2]">$1</strong>')
                    }} />
                );
            } else if (line.match(/^\d+\. /)) {
                elements.push(
                    <li key={i} className="text-[#A8ACCC] mb-1 ml-4 list-decimal" dangerouslySetInnerHTML={{
                        __html: line.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#E8EAF2]">$1</strong>')
                    }} />
                );
            } else if (line.trim() === '') {
                elements.push(<div key={i} className="h-2" />);
            } else {
                elements.push(
                    <p key={i} className="text-[#A8ACCC] leading-relaxed mb-3" dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#E8EAF2]">$1</strong>')
                    }} />
                );
            }
            i++;
        }
        return elements;
    };

    const CategoryIcon = post.categoryIcon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen"
        >
            {/* Hero */}
            <div className="relative h-72 md:h-96 overflow-hidden" style={{ background: post.coverGradient }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <CategoryIcon size={300} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D2E] via-[#1A1D2E]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 pb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(108,126,245,0.3)', color: '#C4CBFF', fontFamily: MONO, border: '1px solid rgba(108,126,245,0.4)' }}>
                            <CategoryIcon size={11} />{post.category}
                        </span>
                        <span className="text-white/50 text-xs" style={{ fontFamily: MONO }}>{post.readTime}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: SERIF }}>{post.title}</h1>
                </div>
            </div>

            {/* Article */}
            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-[#3B4FD8]/20">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#6C7EF5] hover:text-[#E8EAF2] transition-colors text-sm"
                        style={{ fontFamily: MONO }}
                    >
                        <ArrowLeft size={14} /> Back to Blog
                    </button>
                    <div className="flex-1" />
                    <span className="text-[#8B90B8] text-sm" style={{ fontFamily: MONO }}>
                        By {post.author} · {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs text-[#6C7EF5]"
                            style={{ background: 'rgba(108,126,245,0.1)', fontFamily: MONO, border: '1px solid rgba(108,126,245,0.2)' }}>
                            <Tag size={9} />{tag}
                        </span>
                    ))}
                </div>

                {/* Content */}
                <div className="prose-emote">
                    {renderContent(post.content)}
                </div>

                {/* CTA */}
                <div className="mt-14 p-8 rounded-2xl text-center"
                    style={{ background: 'linear-gradient(135deg, rgba(59,79,216,0.15) 0%, rgba(108,126,245,0.1) 100%)', border: '1px solid rgba(108,126,245,0.25)' }}>
                    <BookOpen size={32} className="mx-auto mb-4 text-[#6C7EF5]" />
                    <h3 className="text-xl font-semibold text-[#E8EAF2] mb-2" style={{ fontFamily: SERIF }}>Ready to Start Learning?</h3>
                    <p className="text-[#8B90B8] text-sm mb-6">Join 50,000+ learners on Emote Technology. Get certified, get hired.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => { window.scrollTo(0, 0); window.location.href = '/courses'; }}
                            className="px-6 py-2.5 text-sm font-medium text-white rounded-lg"
                            style={{ background: 'linear-gradient(135deg, #3B4FD8, #6C7EF5)', boxShadow: '0 4px 14px rgba(59,79,216,0.35)' }}
                        >
                            Browse Courses
                        </button>
                        <button
                            onClick={() => { window.scrollTo(0, 0); window.location.href = '/ai-interview'; }}
                            className="px-6 py-2.5 text-sm font-medium text-[#E8EAF2] rounded-lg"
                            style={{ border: '1px solid rgba(108,126,245,0.4)', background: 'rgba(108,126,245,0.08)' }}
                        >
                            Try AI Interview
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ─────────── Main Blog Page ─────────── */
const Blog = () => {
    const navigate = useNavigate();
    const { slug } = useParams();

    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);

    // Update document title and meta for SEO
    useEffect(() => {
        if (selectedPost) {
            document.title = `${selectedPost.title} | Emote Technology Blog`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', selectedPost.excerpt);
            window.scrollTo(0, 0);
        } else {
            document.title = 'Blog – Career & Learning Insights | Emote Technology';
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', 'Expert articles on AI interview prep, tech careers, online learning, and in-demand skills. Updated regularly by the Emote Technology team.');
        }
    }, [selectedPost]);

    // Handle URL slug if present
    useEffect(() => {
        if (slug) {
            const post = blogPosts.find(p => p.slug === slug);
            if (post) setSelectedPost(post);
        }
    }, [slug]);

    const handleRead = (post) => {
        setSelectedPost(post);
        navigate(`/blog/${post.slug}`, { replace: true });
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setSelectedPost(null);
        navigate('/blog', { replace: true });
        window.scrollTo(0, 0);
    };

    const filtered = blogPosts.filter(post => {
        const matchCat = activeCategory === 'All' || post.category === activeCategory;
        const matchSearch = !searchQuery ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
    });

    const featured = filtered.filter(p => p.featured);
    const regular = filtered.filter(p => !p.featured);

    return (
        <div className="min-h-screen bg-[#1A1D2E] text-[#E8EAF2] overflow-x-hidden">
            <Background />
            <Navbar />

            <div className="pt-20">
                <AnimatePresence mode="wait">
                    {selectedPost ? (
                        <ArticleReader key="article" post={selectedPost} onBack={handleBack} />
                    ) : (
                        <motion.div key="listing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                            {/* Page header */}
                            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-center max-w-2xl mx-auto mb-12"
                                >
                                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#6C7EF5] mb-4" style={{ fontFamily: MONO }}>
                                        Knowledge Hub
                                    </p>
                                    <h1 className="text-4xl md:text-5xl font-bold text-[#E8EAF2] mb-4 leading-tight" style={{ fontFamily: SERIF }}>
                                        Insights for the Modern Learner
                                    </h1>
                                    <p className="text-[#8B90B8] leading-relaxed">
                                        Expert articles on AI interviews, in-demand tech skills, career strategies, and accelerated learning — written for ambitious professionals.
                                    </p>
                                </motion.div>

                                {/* Search + Categories */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="flex flex-col md:flex-row gap-4 items-center"
                                >
                                    {/* Search */}
                                    <div className="relative w-full md:w-72">
                                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B90B8]" />
                                        <input
                                            type="text"
                                            placeholder="Search articles…"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 text-sm text-[#E8EAF2] placeholder-[#8B90B8] rounded-xl outline-none transition-all"
                                            style={{
                                                background: 'rgba(37,42,65,0.8)',
                                                border: '1px solid rgba(108,126,245,0.2)',
                                            }}
                                        />
                                    </div>

                                    {/* Category pills */}
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                                    activeCategory === cat
                                                        ? 'text-white shadow-lg'
                                                        : 'text-[#8B90B8] hover:text-[#E8EAF2]'
                                                }`}
                                                style={{
                                                    background: activeCategory === cat
                                                        ? 'linear-gradient(135deg, #3B4FD8, #6C7EF5)'
                                                        : 'rgba(37,42,65,0.6)',
                                                    border: activeCategory === cat
                                                        ? 'none'
                                                        : '1px solid rgba(108,126,245,0.15)',
                                                    boxShadow: activeCategory === cat ? '0 4px 12px rgba(59,79,216,0.35)' : 'none',
                                                    fontFamily: MONO,
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Articles grid */}
                            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
                                {filtered.length === 0 ? (
                                    <div className="text-center py-20">
                                        <BookOpen size={48} className="mx-auto mb-4 text-[#3B4FD8] opacity-50" />
                                        <p className="text-[#8B90B8] text-lg">No articles found for "{searchQuery}"</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Featured */}
                                        {featured.length > 0 && (
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Star size={13} className="text-[#F5A623]" />
                                                    <span className="text-[10px] tracking-widest uppercase text-[#F5A623]" style={{ fontFamily: MONO }}>Featured</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    {featured.map((post, i) => (
                                                        <motion.div
                                                            key={post.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                        >
                                                            <BlogCard post={post} onRead={handleRead} />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Regular */}
                                        {regular.length > 0 && (
                                            <div>
                                                {featured.length > 0 && (
                                                    <div className="flex items-center gap-2 mb-4 mt-8">
                                                        <BookOpen size={13} className="text-[#6C7EF5]" />
                                                        <span className="text-[10px] tracking-widest uppercase text-[#6C7EF5]" style={{ fontFamily: MONO }}>More Articles</span>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                    {regular.map((post, i) => (
                                                        <motion.div
                                                            key={post.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.08 }}
                                                        >
                                                            <BlogCard post={post} onRead={handleRead} />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="md:hidden h-16" />
            <Footer />
        </div>
    );
};

export default Blog;
