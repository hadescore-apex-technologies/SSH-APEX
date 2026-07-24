import math
import re
import os
import json
import urllib.request
from datetime import datetime, timedelta

# Session-based conversation memory
CONVERSATION_HISTORY = {}  # session_id -> list of messages

# Company Knowledge Base
COMPANY_KNOWLEDGE = [
    {
        "intent": "general",
        "question": "What is Hadescore Apex & Technologies?",
        "keywords": "hi hello hey help who what options",
        "answer": (
            "I am the Hadescore Apex Knowledge Assistant. Here is what I can tell you about:\n\n"
            "1. Services: Our custom software, mobile, AI, and cloud development solutions.\n"
            "2. Learning Hub: The 8 professional training tracks we offer.\n"
            "3. Careers: Available job openings and how to submit resumes.\n"
            "4. Contact: Phone numbers, emails, and office location.\n"
            "5. Solutions: The industries we design products for.\n"
            "6. Pricing: Cost details for training and technology services.\n\n"
            "Please ask me about any of these topics, and I will share point-by-point details!"
        )
    },
    {
        "intent": "services",
        "question": "What services do you offer?",
        "keywords": "services work develop build software mobile app ui ux ai devops automation internship trading fintech blockchain web3",
        "answer": (
            "Hadescore Apex provides premium digital transformation services:\n\n"
            "1. Software Engineering:\n"
            "   • Enterprise web applications, responsive architectures, and optimized database systems.\n"
            "2. Mobile & UI/UX Design:\n"
            "   • Premium native app development paired with intuitive, high-fidelity interfaces.\n"
            "3. AI & Automation:\n"
            "   • Integration of predictive models, chatbots, and script-driven workflow automations.\n"
            "4. Cloud & DevOps:\n"
            "   • Containerized systems, automated CI/CD pipelines, and secure cloud orchestration.\n"
            "5. Digital Growth & SEO:\n"
            "   • Branding campaigns, content strategies, and organic SEO ranking optimization.\n"
            "6. Internship Programs:\n"
            "   • Real-time industry project training, tech-stack mentorship, and career placement bootcamps.\n"
            "7. Trading & FinTech Solutions:\n"
            "   • Algorithmic trading systems, custom chart analysis platforms, and portfolio automation engines.\n"
            "8. Web3 & Blockchain Systems:\n"
            "   • Smart contract development, decentralized apps (DApps), and tokenomics consulting."
        )
    },
    {
        "intent": "courses",
        "question": "What courses do you offer at the Learning Hub?",
        "keywords": "course courses learn study program programs training track tracks batch syllabus classes",
        "answer": (
            "We offer 8 professional technology acceleration tracks at the Learning Hub:\n\n"
            "1. MERN Fullstack Development:\n"
            "   • Complete web architectures using React, Node.js, Express, and MongoDB.\n"
            "2. Kotlin/Flutter Mobile Dev:\n"
            "   • Cross-platform apps with Flutter and native Android development with Kotlin.\n"
            "3. AI & Prompt Engineering:\n"
            "   • Custom LLM integrations, prompt design, and operational automation.\n"
            "4. Cybersecurity SOC:\n"
            "   • Network defense, log analysis, threat intelligence, and security operations.\n"
            "5. Mechatronics & Robotics:\n"
            "   • Control systems, circuit layout design, sensor integration, and microcontrollers.\n"
            "6. Drone Design & UAVs:\n"
            "   • Aerodynamics, flight controllers, electronics, and assembly.\n"
            "7. Biotech & Bioinformatics:\n"
            "   • Computational biology, gene sequence analysis, and bioinformatics tooling.\n"
            "8. Startup Bootcamp & Incubation:\n"
            "   • Ideation prep, investor deck creation, financial modeling, and company registration."
        )
    },
    {
        "intent": "careers",
        "question": "Are you hiring / how do I apply for jobs?",
        "keywords": "career careers job jobs hiring apply work developer engineer resume positions",
        "answer": (
            "Join the Hadescore Apex team! Here is how our career process works:\n\n"
            "1. Open Positions:\n"
            "   • We consistently recruit Frontend Developers (React), Backend Engineers (Django / Node), Mobile Developers, and Domain Mentors.\n"
            "2. Work Environment:\n"
            "   • Continuous learning, industry projects, paid PTO, and competitive salaries.\n"
            "3. How to Apply:\n"
            "   • Go directly to the 'Careers' page on our website.\n"
            "   • Select an active position, fill in your details, and upload your resume."
        )
    },
    {
        "intent": "contact",
        "question": "How do I contact you / where is your office?",
        "keywords": "contact phone email address location reach support call whatsapp office address details location",
        "answer": (
            "You can connect with us directly using these channels:\n\n"
            "1. Email Inquiries:\n"
            "   • Send your queries directly to hadescore.apex.technologies@gmail.com.\n"
            "2. Phone Support:\n"
            "   • Call us at +91 9790080274 for immediate inquiries.\n"
            "3. WhatsApp Support:\n"
            "   • Message or call +91 9790080274 to chat with a support executive.\n"
            "4. Office Address:\n"
            "   • Coimbatore, Tamil Nadu, India.\n"
            "5. Contact Form:\n"
            "   • Submit an online message via the 'Contact' page, and we will reply within 24 hours."
        )
    },
    {
        "intent": "pricing",
        "question": "What is the pricing / cost?",
        "keywords": "price cost pricing rate fee fees catalog calculator quote dynamic cost structure model",
        "answer": (
            "Here is our pricing structure:\n\n"
            "1. Learning Hub Courses:\n"
            "   • We offer transparent standard fees for online and offline batches.\n"
            "   • You can use the Catalog Calculator on the 'Learning Hub' page to estimate total costs.\n"
            "2. Custom Software & Technology Services:\n"
            "   • Priced project-by-project based on scope, features, and timeline.\n"
            "   • To request a custom quote, please submit a brief on the 'Start Project' page.\n"
            "3. Startup Incubation Program:\n"
            "   • Flexible packages including cohort fees or equity-backed incubation models."
        )
    },
    {
        "intent": "solutions",
        "question": "What solutions/industries do you work with?",
        "keywords": "solution solutions industries finance supply chain healthcare manufacturing retail fintech logic",
        "answer": (
            "We build custom enterprise solutions tailored for key industries:\n\n"
            "1. FinTech (FIN):\n"
            "   • Secure transactions, ledger architectures, and asset management platforms.\n"
            "2. Supply Chain & Logistics (SUP):\n"
            "   • Real-time warehouse monitoring, route trackers, and dispatch optimization.\n"
            "3. HealthTech (HLT):\n"
            "   • Secure patient record databases and intuitive diagnostic portals.\n"
            "4. Smart Manufacturing (MFG):\n"
            "   • IoT integrations, device control interfaces, and predictive maintenance logs.\n"
            "5. EduTech (EDU):\n"
            "   • Interactive course repositories, online assignment systems, and student analytics.\n"
            "6. Retail (RET):\n"
            "   • Fast checkout flows, inventory triggers, and customer engagement applications."
        )
    },
    {
        "intent": "leaders",
        "question": "Who is on the leadership team / who runs the company?",
        "keywords": "leaders leader team founder founders executive ceo management board director",
        "answer": (
            "Hadescore Apex & Technologies is guided by a team of visionary technologists and educators:\n\n"
            "1. Executive Leadership:\n"
            "   • Our leaders coordinate custom services, educational curricula, and startup incubation divisions.\n"
            "2. Expert Mentors:\n"
            "   • Academic training and technology projects are supervised directly by certified domain experts."
        )
    },
    {
        "intent": "products",
        "question": "What products do you build?",
        "keywords": "product products saas application applications tool tools crm build owns",
        "answer": (
            "We design and build affordable, scalable SaaS products for local and global markets:\n\n"
            "1. Active Products:\n"
            "   • Enterprise CRM tools, CRM automations, and custom communication platforms.\n"
            "2. Future Pipelines:\n"
            "   • Keep an eye on our 'Coming Soon' product tab for new SaaS applications currently under development."
        )
    },
    {
        "intent": "apex",
        "question": "What is the Apex Grid / Technology focus?",
        "keywords": "apex grid tech stack technologies artificial intelligence iot biotech robotics mechatronics",
        "answer": (
            "The Apex Grid represents our multi-disciplinary advanced technology focus:\n\n"
            "1. Artificial Intelligence & ML\n"
            "2. IoT & Smart Sensors\n"
            "3. Robotics & Mechatronics\n"
            "4. Drone Engineering & UAVs\n"
            "5. Biotechnology & Bioinformatics\n"
            "6. Cybersecurity SOC operations"
        )
    },
    {
        "intent": "start_project",
        "question": "How do I start a project with you?",
        "keywords": "start project brief hire build build app custom project quote request proposal estimate",
        "answer": (
            "Starting a project with us is simple:\n\n"
            "1. Submit a Brief:\n"
            "   • Go to the 'Start Project' page on our website.\n"
            "2. Input details:\n"
            "   • Tell us about your company, target objectives, scope, and estimated budget.\n"
            "3. Executive Review:\n"
            "   • Our software engineering lead will review your submission and schedule a scoping call within 24 hours."
        )
    },
    {
        "intent": "blogs",
        "question": "What are your latest blogs / news?",
        "keywords": "blog blogs post posts news article articles updates read read blog latest news",
        "answer": (
            "We publish regular technology insights and company announcements on our Blog page:\n\n"
            "1. Tech Insights:\n"
            "   • Articles covering Software Engineering, AI trends, DevOps, and talent acceleration.\n"
            "2. Reading Blog:\n"
            "   • Visit the 'Blog' page on our website to read the full articles with code snippets and live demos."
        )
    }
]

# Simple Local TF-IDF Matcher
STOP_WORDS = {"is", "what", "how", "do", "you", "we", "our", "are", "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "with", "about", "of", "me", "tell", "please", "some", "my"}

def tokenize(text):
    tokens = re.findall(r'\w+', text.lower())
    return [t for t in tokens if t not in STOP_WORDS]

def get_cosine_similarity(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])
    
    sum1 = sum([vec1[x]**2 for x in vec1.keys()])
    sum2 = sum([vec2[x]**2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    
    if not denominator:
        return 0.0
    return float(numerator) / denominator

def get_tf_vector(tokens):
    tf = {}
    for t in tokens:
        tf[t] = tf.get(t, 0) + 1
    total = len(tokens)
    if total == 0:
        return {}
    for t in tf:
        tf[t] = tf[t] / total
    return tf

# Prepare Knowledge vectors
ALL_DOCS = []
for idx, doc in enumerate(COMPANY_KNOWLEDGE):
    doc_text = doc["question"] + " " + doc["keywords"]
    ALL_DOCS.append((idx, tokenize(doc_text)))

# Compute IDF for vocabulary
DF = {}
for idx, tokens in ALL_DOCS:
    for token in set(tokens):
        DF[token] = DF.get(token, 0) + 1

NUM_DOCS = len(COMPANY_KNOWLEDGE)
IDF = {}
for token, df in DF.items():
    IDF[token] = math.log((1 + NUM_DOCS) / (1 + df)) + 1

# Calculate TF-IDF vector for each document
DOC_VECTORS = []
for idx, tokens in ALL_DOCS:
    tf = get_tf_vector(tokens)
    tfidf = {t: tf[t] * IDF.get(t, 1.0) for t in tf}
    DOC_VECTORS.append((idx, tfidf))

def get_local_response(query):
    query_tokens = tokenize(query)
    if not query_tokens:
        return COMPANY_KNOWLEDGE[0]["answer"]
        
    query_tf = get_tf_vector(query_tokens)
    query_tfidf = {t: query_tf[t] * IDF.get(t, 1.0) for t in query_tf}
    
    best_score = 0.0
    best_idx = 0
    
    for idx, doc_tfidf in DOC_VECTORS:
        score = get_cosine_similarity(query_tfidf, doc_tfidf)
        
        # Boost score if query contains explicit intent keywords
        doc_kws = tokenize(COMPANY_KNOWLEDGE[idx]["keywords"])
        intersection = set(query_tokens) & set(doc_kws)
        if intersection:
            score += 0.25 * len(intersection)
            
        if score > best_score:
            best_score = score
            best_idx = idx
            
    if best_score < 0.15:
        return (
            "I'm here to help you with anything related to Hadescore Apex & Technologies!\n\n"
            "Here is what I can assist you with:\n"
            "1. Software Services: Software engineering, mobile apps, UI/UX, AI, and DevOps.\n"
            "2. Learning Hub: Details about our 8 technology training tracks.\n"
            "3. Careers: Job openings, applications, and internship opportunities.\n"
            "4. Office Contact: Email, phone support, and office location.\n"
            "5. Business Solutions: Tailored software solutions for FinTech, retail, healthcare, etc.\n"
            "6. Project Initiation: How to submit a project brief and request quotes.\n\n"
            "Could you please rephrase your query or ask about one of these topics?"
        )
        
    answer = COMPANY_KNOWLEDGE[best_idx]["answer"]
    if COMPANY_KNOWLEDGE[best_idx]["intent"] == "blogs":
        try:
            from api.models import BlogPost
            latest_posts = BlogPost.objects.filter(is_published=True).order_by('-published_at')[:3]
            if latest_posts.exists():
                titles = "\n".join([f"   • {post.title}" for post in latest_posts])
                answer += f"\n\nOur latest published articles include:\n{titles}"
        except Exception:
            pass
            
    return answer

# LLM Gemini API Handler with History Support
def get_gemini_response_with_history(query, api_key, history=None):
    system_prompt = (
        "You are the official Hadescore Apex & Technologies Chatbot Assistant. "
        "Your task is to answer user queries accurately based on the company details provided below. "
        "Always respond in a professional and premium tone. "
        "Always structure your answers point-by-point (using numbers or bullet points) and preserve spacing so it is extremely easy to read.\n\n"
        "CRITICAL REQUIREMENT: If the user's query is unrelated to Hadescore Apex & Technologies, its services, courses, careers, contact information, or business solutions (for example, general knowledge, homework, coding questions unrelated to our services, or inappropriate/off-topic prompts), you MUST politely decline to answer. Respond with: 'I can only assist with questions regarding Hadescore Apex & Technologies services, courses, careers, and contact info. Please let me know how I can help you with these topics!'\n\n"
        "Company Details:\n"
        "- Name: Hadescore Apex & Technologies\n"
        "- Location: Coimbatore, Tamil Nadu, India\n"
        "- Contacts: Email hadescore.apex.technologies@gmail.com, Phone & WhatsApp +91 9790080274\n"
        "- Services Offered:\n"
        "  1. Software Engineering: Enterprise web systems, robust databases.\n"
        "  2. Mobile & UI/UX: Native Kotlin/Flutter apps and premium user interfaces.\n"
        "  3. AI & Automation: Custom LLM integrations, script automations.\n"
        "  4. Cloud & DevOps: Docker, CI/CD pipelines, scaling server architectures.\n"
        "  5. Digital Growth: SEO optimizations, branding strategies.\n"
        "  6. Internship Programs: Structured industry experience, mentoring, and bootcamps.\n"
        "  7. Trading & FinTech: Algorithmic trading bots and quantitative analytics tools.\n"
        "  8. Web3 & Blockchain: Smart contracts, DApps, and tokenomics consulting.\n"
        "- Learning Hub tracks (8 professional courses):\n"
        "  1. MERN Fullstack Development\n"
        "  2. Kotlin/Flutter Mobile Dev\n"
        "  3. AI & Prompt Engineering\n"
        "  4. Cybersecurity SOC\n"
        "  5. Mechatronics & Robotics\n"
        "  6. Drone Design & UAV assembly\n"
        "  7. Biotech & Bioinformatics\n"
        "  8. Startup Bootcamp & business incubation\n"
        "- Business Solutions: Industry products for FinTech (FIN), Supply Chain (SUP), HealthTech (HLT), Smart Manufacturing (MFG), EduTech (EDU), and Retail (RET).\n"
        "- Careers: We hire React frontend developers, Django/Node backend developers, mobile developers, and domain mentors. Candidates apply via the Careers page.\n"
        "- Blogs/News: We write tech articles and updates about Software Engineering, AI, and Cybersecurity. Users can read them on the Blog page."
    )
    
    # Build contents with conversation history
    contents = []
    
    # Add system context
    contents.append({
        "parts": [{"text": f"System Context: {system_prompt}"}]
    })
    
    # Add conversation history if available
    if history:
        for msg in history[-8:]:  # Last 8 messages for context
            role_label = "User" if msg["role"] == "user" else "Assistant"
            contents.append({
                "parts": [{"text": f"{role_label}: {msg['content']}"}]
            })
    
    # Add current query
    contents.append({
        "parts": [{"text": f"User Query: {query}"}]
    })
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1000
        }
    }
    
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=8) as res:
            response_data = json.loads(res.read().decode())
            text_response = response_data['candidates'][0]['content']['parts'][0]['text']
            return text_response
    except Exception as e:
        return get_local_response(query)

def get_chatbot_reply(query):
    """Legacy function without context - kept for backward compatibility"""
    gemini_key = os.environ.get('GEMINI_API_KEY', None)
    if gemini_key:
        return get_gemini_response_with_history(query, gemini_key)
    else:
        return get_local_response(query)

def get_chatbot_reply_with_context(query, session_id=None):
    """Enhanced version with conversation memory"""
    
    # Initialize session if needed
    if session_id and session_id not in CONVERSATION_HISTORY:
        CONVERSATION_HISTORY[session_id] = []
    
    # Add user query to history
    if session_id:
        CONVERSATION_HISTORY[session_id].append({
            "role": "user", 
            "content": query,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep only last 20 messages for memory efficiency
        if len(CONVERSATION_HISTORY[session_id]) > 20:
            CONVERSATION_HISTORY[session_id] = CONVERSATION_HISTORY[session_id][-20:]
    
    # Get response
    gemini_key = os.environ.get('GEMINI_API_KEY', None)
    
    if gemini_key and session_id:
        response = get_gemini_response_with_history(
            query, 
            gemini_key, 
            CONVERSATION_HISTORY[session_id]
        )
    elif gemini_key:
        response = get_gemini_response_with_history(query, gemini_key)
    else:
        response = get_local_response(query)
    
    # Add assistant response to history
    if session_id:
        CONVERSATION_HISTORY[session_id].append({
            "role": "assistant", 
            "content": response,
            "timestamp": datetime.now().isoformat()
        })
    
    return response

def format_rich_response(intent, answer):
    """Add structured data to responses for rich UI"""
    rich_data = {
        "text": answer,
        "type": "text",
        "actions": []
    }
    
    if intent == "courses":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "View All Courses", "url": "/learninghub"},
            {"label": "Enroll Now", "url": "/learninghub#enroll"}
        ]
    elif intent == "contact":
        rich_data["type"] = "contact_card"
        rich_data["actions"] = [
            {"label": "📧 Send Email", "url": "mailto:hadescore.apex.technologies@gmail.com"},
            {"label": "📞 Call Now", "url": "tel:+919790080274"},
            {"label": "💬 Contact Form", "url": "/contact"}
        ]
    elif intent == "careers":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "View Open Positions", "url": "/careers"},
            {"label": "Submit Resume", "url": "/careers#apply"}
        ]
    elif intent == "pricing":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "Course Pricing", "url": "/learninghub"},
            {"label": "Request Quote", "url": "/start-project"}
        ]
    elif intent == "services":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "View Services", "url": "/services"},
            {"label": "Start Project", "url": "/start-project"}
        ]
    elif intent == "leaders":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "Meet the Team", "url": "/about#leaders"}
        ]
    elif intent == "products":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "Explore Products", "url": "/products"}
        ]
    elif intent == "apex":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "Explore Tech Grid", "url": "/apex"}
        ]
    elif intent == "start_project":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "Start Project Form", "url": "/start-project"}
        ]
    elif intent == "blogs":
        rich_data["type"] = "card"
        rich_data["actions"] = [
            {"label": "Read Latest Blogs", "url": "/blog"}
        ]
    
    return rich_data
