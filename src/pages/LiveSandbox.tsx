import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';
import SEO from '../components/SEO/SEO';
import { 
  ArrowLeft, 
  RefreshCw, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  Send, 
  Smartphone, 
  AlertTriangle, 
  Activity, 
  Sliders, 
  Cpu, 
  Layers, 
  MapPin, 
  Clock, 
  Filter, 
  Database,
  Globe,
  Share2,
  LockKeyhole
} from 'lucide-react';
import './LiveSandbox.css';

// Localized Bangalore Landmark Hub Vectors
const BANGALORE_LANDMARKS = {
  btm_hub: [12.9166, 77.6101],
  silk_board: [12.9176, 77.6231],
  koramangala_4th: [12.9343, 77.6253],
  accenture_corp: [12.9317, 77.6358]
};

// Initial preloaded mock states with Bangalore localization and mock UPI handles
const INITIAL_TRANSACTIONS = [
  { id: 'TX-9011', type: 'transfer', description: 'Transfer to Anjali P. (UPI: anjali.p@okhdfc)', amount: 15000.00, status: 'Completed', date: 'Just now' },
  { id: 'TX-8902', type: 'deposit', description: 'Salary Payout - Accenture India (Koramangala Office)', amount: 48000.00, status: 'Completed', date: '2 hours ago' },
  { id: 'TX-8743', type: 'transfer', description: 'ACT Fibernet - Koramangala 4th Block Bill', amount: 1250.00, status: 'Completed', date: 'Yesterday' }
];

const INITIAL_POSTS = [
  { id: 1, author: 'Kiran Das', role: 'Data Science Grad', content: 'Just deployed the Power BI embedded pipeline. Optimizing pandas chunks reduced memory loads by 45%. Check out my latest repo metrics! 🔥', likes: 12, date: '10 mins ago' },
  { id: 2, author: 'Priya Sharma', role: 'QA Lead', content: 'Automated 120 checkout flows using Selenium WebDriver grid. Cucumber BDD syntax makes test reports readable for product managers. ', likes: 8, date: '1 hour ago' }
];

// 7 detailed mock production code scripts matching tech stack
const MOCK_SOURCE_FILES: Record<string, { filename: string; language: string; code: string }> = {
  'java-banking-system': {
    filename: 'TransactionService.java',
    language: 'java',
    code: `package com.appteknow.bank.service;

import com.appteknow.bank.model.Transaction;
import com.appteknow.bank.repository.TransactionRepository;
import com.appteknow.bank.exception.InsufficentBalanceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {
    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);
    
    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public Transaction executeTransfer(String senderUpi, String recipientUpi, BigDecimal amount) {
        log.info("Initiating secure transfer of {} from {} to {}", amount, senderUpi, recipientUpi);
        
        // Fetch and lock accounts to prevent race conditions (PESSIMISTIC_WRITE)
        BigDecimal senderBalance = transactionRepository.getBalanceForUpi(senderUpi);
        if (senderBalance.compareTo(amount) < 0) {
            log.error("Transfer failed: Insufficient ledger balance for {}", senderUpi);
            throw new InsufficentBalanceException("Insufficient funds in sender account ledger");
        }
        
        // Deduct from sender and credit to recipient
        transactionRepository.updateBalance(senderUpi, amount.negate());
        transactionRepository.updateBalance(recipientUpi, amount);
        
        // Log transaction record
        Transaction tx = new Transaction();
        tx.setSenderUpi(senderUpi);
        tx.setRecipientUpi(recipientUpi);
        tx.setAmount(amount);
        tx.setStatus("COMPLETED");
        tx.setTimestamp(LocalDateTime.now());
        
        Transaction committedTx = transactionRepository.save(tx);
        log.info("Transaction committed successfully. TxID: {}", committedTx.getId());
        return committedTx;
    }
}`
  },
  'testing-ecom-suite': {
    filename: 'CheckoutSteps.java',
    language: 'java',
    code: `package com.appteknow.qa.steps;

import io.cucumber.java.en.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import java.time.Duration;

public class CheckoutSteps {
    private WebDriver driver = WebDriverManager.getDriver();
    private WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    @Given("User is logged in and cart contains item {string}")
    public void verifyCartContainsItem(String skuCode) {
        driver.get("http://localhost:8080/cart");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cart-table")));
        WebElement item = driver.findElement(By.xpath("//tr[contains(@class, 'item-row')]//span[text()='" + skuCode + "']"));
        Assert.assertNotNull(item, "Item SKU code " + skuCode + " not present in checkout cart");
    }

    @When("User proceeds to checkout and enters shipping detail")
    public void proceedToCheckout() {
        driver.findElement(By.id("btn-checkout")).click();
        wait.until(ExpectedConditions.urlContains("/checkout/shipping"));
        driver.findElement(By.name("shippingAddress")).sendKeys("BTM Layout 2nd Stage, Outer Ring Rd, Bangalore");
        driver.findElement(By.id("btn-proceed-payment")).click();
    }

    @And("User submits payment via Stripe Token {string}")
    public void submitStripePayment(String token) {
        wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(By.className("stripe-iframe")));
        WebElement stripeInput = wait.until(ExpectedConditions.elementToBeClickable(By.id("card-element")));
        stripeInput.sendKeys(token);
        driver.switchTo().defaultContent();
        driver.findElement(By.id("btn-pay-now")).click();
    }

    @Then("Validate checkout success callback updates order status to {string}")
    public void validateOrderSuccess(String expectedStatus) {
        WebElement successBanner = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("payment-success-msg")));
        Assert.assertTrue(successBanner.getText().contains("Success"));
        
        // Assert order record updated in DB
        driver.get("http://localhost:8080/account/orders");
        String dbStatus = driver.findElement(By.className("order-status-badge")).getText();
        Assert.assertEquals(dbStatus, expectedStatus, "Order database verification failed");
    }
}`
  },
  'python-retail-dashboard': {
    filename: 'forecasting_engine.py',
    language: 'python',
    code: `import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.statespace.sarimax import SARIMAX
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_sarimax_predictions(historical_sales_csv, marketing_budget, demand_multiplier):
    """
    Fits a SARIMAX regression model to predict next-month retail demand.
    Tuned with localized marketing budget and seasonal multipliers.
    """
    logger.info("Loading sales records dataset...")
    df = pd.read_csv(historical_sales_csv, parse_dates=['date'], index_col='date')
    
    # Resample sales to daily sums
    daily_sales = df['sales_amount'].resample('D').sum().fillna(0)
    
    # Define exogenous features (budget, multiplier)
    exog_data = pd.DataFrame(index=daily_sales.index)
    exog_data['marketing_budget'] = marketing_budget
    exog_data['demand_factor'] = demand_multiplier
    
    logger.info("Fitting SARIMAX(1, 1, 1)x(0, 1, 1, 7) forecasting model...")
    model = SARIMAX(daily_sales, 
                    order=(1, 1, 1), 
                    seasonal_order=(0, 1, 1, 7), 
                    exog=exog_data)
    
    model_fit = model.fit(disp=False)
    logger.info(f"Model fitted. AIC: {model_fit.aic:.2f}")
    
    # Forecast next 30 days
    future_exog = pd.DataFrame(index=pd.date_range(start=daily_sales.index[-1] + pd.Timedelta(days=1), periods=30))
    future_exog['marketing_budget'] = marketing_budget
    future_exog['demand_factor'] = demand_multiplier
    
    forecast = model_fit.get_forecast(steps=30, exog=future_exog)
    predictions = forecast.predicted_mean.clip(lower=0)
    confidence_intervals = forecast.conf_int()
    
    logger.info("Demand forecasting successfully generated.")
    return predictions.to_dict(), confidence_intervals.to_dict()`
  },
  'data-analytics-omni': {
    filename: 'bi_pipeline.py',
    language: 'python',
    code: `import sqlite3
import pandas as pd
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("omni_bi_pipeline")

def execute_etl_sync(db_path, target_region="all", category_filter="all"):
    """
    Extracts sqlite transaction records, aggregates sales parameters,
    and updates dynamic schemas for BI dashboards.
    """
    logger.info(f"Connecting to SQLite database: {db_path}")
    conn = sqlite3.connect(db_path)
    
    # Extraction
    query = """
        SELECT t.id, t.sku, t.category, t.price, t.quantity, t.region, t.date
        FROM transactions t
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    logger.info(f"Extracted {len(df)} transactions records. Proceeding with transformation...")
    
    # Transformation (Data cleaning)
    df['price'] = pd.to_numeric(df['price'], errors='coerce').fillna(0.0)
    df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce').fillna(0)
    df['gross_sales'] = df['price'] * df['quantity']
    
    # Filter operations
    if target_region != "all":
        df = df[df['region'].str.lower() == target_region.lower()]
    if category_filter != "all":
        df = df[df['category'].str.lower() == category_filter.lower()]
        
    # Aggregation
    kpis = {
        "gross_sales_pipeline": float(df['gross_sales'].sum()),
        "total_units_sold": int(df['quantity'].sum()),
        "average_conversion": float(np.where(len(df) > 0, (len(df[df['gross_sales'] > 0]) / len(df)) * 100, 0.0))
    }
    
    logger.info(f"Aggregated BI matrix completed: Sales: {kpis['gross_sales_pipeline']:.2f}")
    return kpis`
  },
  'mern-dev-network': {
    filename: 'feedRouter.js',
    language: 'javascript',
    code: `const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

// @route   POST /api/posts
// @desc    Create a community feed post
// @access  Private (JWT Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content, authorName } = req.body;
        
        if (!content || !content.trim()) {
            logger.error("Attempted to publish empty MERN feed post");
            return res.status(400).json({ error: 'Post content is required' });
        }
        
        logger.info(\`User \${req.user.id} attempting to create feed post\`);
        
        const newPost = new Post({
            author: authorName || req.user.name,
            authorId: req.user.id,
            role: 'AppTeknow Graduate',
            content: content.trim(),
            likes: 0,
            date: new Date()
        });

        const savedPost = await newPost.save();
        logger.info(\`Post published successfully. ID: \${savedPost._id}\`);
        
        res.status(201).json(savedPost);
    } catch (err) {
        logger.error(\`MERN API Route crashed: \${err.message}\`);
        res.status(500).json({ error: 'Internal Server DB Sync Failure' });
    }
});

// @route   GET /api/posts
// @desc    Fetch all posts ordered by date desc
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }).limit(10);
        res.json(posts);
    } catch (err) {
        logger.error(\`Failed to query database: \${err.message}\`);
        res.status(500).json({ error: 'Database query execution failure' });
    }
});

module.exports = router;`
  },
  'cyber-threat-engine': {
    filename: 'subnet_scanner.py',
    language: 'python',
    code: `from scapy.all import ARP, Ether, srp
import socket
import threading
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aegis_scanner")

class SubnetScanner:
    def __init__(self, subnet_cidr="192.168.1.0/24"):
        self.subnet = subnet_cidr
        self.discovered_hosts = []
        self.lock = threading.Lock()

    def sweep_arp(self):
        """
        Broadcasting ARP sweep request on network segment: {self.subnet}
        """
        logger.info(f"Broadcasting ARP sweep request on network segment: {self.subnet}")
        arp_req = ARP(pdst=self.subnet)
        ether_broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
        packet = ether_broadcast / arp_req
        
        result = srp(packet, timeout=2, verbose=False)[0]
        
        for sent, received in result:
            host_info = {'ip': received.psrc, 'mac': received.hwsrc}
            self.discovered_hosts.append(host_info)
            logger.info(f"[HOST ALIVE] Found responder at IP: {received.psrc}")
            
        return self.discovered_hosts

    def audit_vulnerability_ports(self, ip):
        """
        Probes target ports to audit vulnerable configurations (e.g. RDP, SSH, HTTP).
        """
        target_ports = [22, 80, 443, 3389, 8080]
        logger.info(f"Auditing standard vulnerability ports on host: {ip}")
        
        for port in target_ports:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(0.5)
            status = s.connect_ex((ip, port))
            if status == 0:
                logger.info(f"[PORT OPEN] {ip}:{port} - active service listener detected.")
                if port == 3389:
                    logger.warning(f"[VULNERABILITY] RDP service exposed on host {ip}:{port}!")
            s.close()`
  },
  'logistics-delivery-system': {
    filename: 'geofence_tracker.py',
    language: 'python',
    code: `import math
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("logistics_geofencer")

# Localized Bangalore Landmark Hub Vectors
BANGALORE_LANDMARKS = {
    "btm_hub": (12.9166, 77.6101),
    "silk_board": (12.9176, 77.6231),
    "koramangala_4th": (12.9343, 77.6253),
    "accenture_corp": (12.9317, 77.6358)
}

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """
    Computes distance matrix vector using Haversine formula for routing.
    """
    R = 6371.0 # Earth's radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    
    a = math.sin(d_lat / 2)**2 + math.cos(math.radians(latLat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    
    return distance

def audit_delivery_geofence(current_lat, current_lon, dest_lat, dest_lon, threshold_meters=150.0):
    """
    Tracks vehicle proximity coordinates. Triggers delivery completion when within geofence limits.
    """
    dist_km = calculate_haversine_distance(current_lat, current_lon, dest_lat, dest_lon)
    dist_meters = dist_km * 1000.0
    
    logger.info(f"Vehicle position coordinates: ({current_lat}, {current_lon}). Distance to destination: {dist_meters:.1f}m")
    
    if dist_meters <= threshold_meters:
        logger.info("[GEOFENCE ACTIVE] Vehicle reached target threshold. Safe to deliver package.")
        return True
    
    return False`
  }
};

const isPredefinedProject = (id: string) => {
  return [
    'java-banking-system',
    'testing-ecom-suite',
    'python-retail-dashboard',
    'data-analytics-omni',
    'mern-dev-network',
    'cyber-threat-engine',
    'logistics-delivery-system'
  ].includes(id);
};

const getDynamicSourceCode = (project: { title: string; studentName: string; challengesSolved: string; techStack: string[]; id: string }) => {
  const isJava = project.techStack.some(t => /java/i.test(t) || /spring/i.test(t));
  const isPython = project.techStack.some(t => /python/i.test(t) || /django/i.test(t) || /flask/i.test(t));
  
  if (isJava) {
    return {
      filename: `${project.title.replace(/[^a-zA-Z0-9]/g, '')}Controller.java`,
      language: 'java',
      code: `package com.appteknow.custom.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ${project.title.replace(/[^a-zA-Z0-9]/g, '')}Controller {
    private static final Logger log = LoggerFactory.getLogger(${project.title.replace(/[^a-zA-Z0-9]/g, '')}Controller.class);

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        log.info("Auditing system health for ${project.title}...");
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("serviceName", "${project.title}");
        health.put("latencyMs", 3);
        health.put("activePoolSize", 12);
        return ResponseEntity.ok(health);
    }

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeTask(@RequestBody Map<String, Object> payload) {
        log.info("Processing microservice payload for student portal: {}", payload);
        
        // Solve challenge: ${project.challengesSolved.replace(/"/g, '\\"')}
        Map<String, Object> response = new HashMap<>();
        response.put("txId", "TX-" + System.currentTimeMillis());
        response.put("status", "SUCCESS");
        response.put("message", "Challenge metrics resolved successfully");
        response.put("appliedStack", "${project.techStack.join(', ')}");
        
        return ResponseEntity.ok(response);
    }
}`
    };
  } else if (isPython) {
    return {
      filename: 'views.py',
      language: 'python',
      code: `import logging
import time
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

# Portfolio Project: ${project.title}
# Student: ${project.studentName}

@api_view(['GET', 'POST'])
def process_gateway_request(request):
    """
    Handles secure operations for ${project.title}.
    Challenge solved: ${project.challengesSolved.replace(/"/g, '\\"')}
    """
    start_time = time.time()
    
    if request.method == 'GET':
        logger.info("Retrieving localized analytics data schema...")
        payload = {
            "project_id": "${project.id}",
            "status": "healthy",
            "model_version": "v2.0.4",
            "active_stack": ${JSON.stringify(project.techStack)},
            "db_latency_ms": int((time.time() - start_time) * 1000)
        }
        return Response(payload, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        logger.info(f"Received API request data: {request.data}")
        time.sleep(0.05) # Simulate database query execution
        
        response_data = {
            "success": True,
            "transaction_hash": "sha256_" + str(int(time.time())),
            "placed_by": "${project.studentName}",
            "audit_stamp": "VERIFIED_APPTEKNOW_AUDIT"
        }
        return Response(response_data, status=status.HTTP_201_CREATED)`
    };
  } else {
    return {
      filename: 'server.js',
      language: 'javascript',
      code: `const express = require('express');
const router = express.Router();
const logger = require('morgan');

// ${project.title} - Main API Gateway
// Tech Stack: ${project.techStack.join(', ')}

router.get('/health', async (req, res) => {
  try {
    res.status(200).json({
      status: 'online',
      system: '${project.title}',
      developer: '${project.studentName}',
      challengesResolved: '${project.challengesSolved.replace(/"/g, '\\"')}'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/submit', async (req, res) => {
  const payload = req.body;
  console.log('Ingesting secure event buffer:', payload);
  
  res.status(201).json({
    status: 'committed',
    timestamp: new Date().toISOString(),
    event_id: 'ev_' + Math.random().toString(36).substr(2, 9),
    data: payload
  });
});

module.exports = router;`
    };
  }
};

// Monospace tokenizing syntax highlighter for IDE view
const tokenizeAndHighlight = (code: string) => {
  return code.split('\n').map((line, idx) => {
    if (!line.trim()) {
      return (
        <div key={idx} className="code-line">
          <span className="code-ln">{idx + 1}</span>
          <span className="code-txt">&nbsp;</span>
        </div>
      );
    }
    
    if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return (
        <div key={idx} className="code-line">
          <span className="code-ln">{idx + 1}</span>
          <span className="code-comment">{line}</span>
        </div>
      );
    }

    const parts: { text: string; type: string }[] = [];
    const tokenRegex = /(\/\/.*|#.*|"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|@\w+|\b(?:package|import|public|class|private|protected|void|return|def|from|const|let|var|function|require|module|exports|extends|throw|new|if|else|try|catch|async|await|as|in|and|or|not|true|false|null|interface|implements|static|final|int|double|float|boolean|char|String)\b|\b[A-Z]\w*\b|\b\d+\b|\w+|\s+|[^\w\s])/g;
    
    let match;
    while ((match = tokenRegex.exec(line)) !== null) {
      const token = match[0];
      let type = 'plain';
      if (token.startsWith('//') || token.startsWith('#')) {
        type = 'comment';
      } else if (token.startsWith('"') || token.startsWith("'")) {
        type = 'string';
      } else if (token.startsWith('@')) {
        type = 'annotation';
      } else if (/^(?:package|import|public|class|private|protected|void|return|def|from|const|let|var|function|require|module|exports|extends|throw|new|if|else|try|catch|async|await|as|in|and|or|not|true|false|null|interface|implements|static|final|int|double|float|boolean|char|String)$/.test(token)) {
        type = 'keyword';
      } else if (/^[A-Z]\w*$/.test(token)) {
        type = 'type';
      } else if (/^\d+$/.test(token)) {
        type = 'number';
      }
      parts.push({ text: token, type });
    }
    
    return (
      <div key={idx} className="code-line">
        <span className="code-ln">{idx + 1}</span>
        <span className="code-txt">
          {parts.map((p, pIdx) => {
            if (p.type === 'comment') return <span key={pIdx} className="code-comment">{p.text}</span>;
            if (p.type === 'string') return <span key={pIdx} className="code-str">{p.text}</span>;
            if (p.type === 'annotation') return <span key={pIdx} className="code-ann">{p.text}</span>;
            if (p.type === 'keyword') return <span key={pIdx} className="code-kw">{p.text}</span>;
            if (p.type === 'type') return <span key={pIdx} className="code-type">{p.text}</span>;
            if (p.type === 'number') return <span key={pIdx} className="code-num">{p.text}</span>;
            return <span key={pIdx}>{p.text}</span>;
          })}
        </span>
      </div>
    );
  });
};

const LiveSandbox: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects } = useDataContext();
  
  // Find project details
  const project = projects.find(p => p.id === projectId);
  
  // Simulation tab / iframe states
  const [addressUrl, setAddressUrl] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic Network Inspector & IDE states
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [inspectorExpanded, setInspectorExpanded] = useState(true);
  const [inspectorLogs, setInspectorLogs] = useState<any[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  // 1. JAVA Core Banking Simulation States
  const [bankBalance, setBankBalance] = useState(548250.00);
  const [bankTransactions, setBankTransactions] = useState(INITIAL_TRANSACTIONS);
  const [recipient, setRecipient] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [bankSending, setBankSending] = useState(false);
  const [bankSuccessMsg, setBankSuccessMsg] = useState(false);
  const [bankLoadSpike, setBankLoadSpike] = useState(false);

  // 2. Selenium QA Automation Test Suite States
  const [qaRunning, setQaRunning] = useState(false);
  const [qaProgress, setQaProgress] = useState(0);
  const [qaLogs, setQaLogs] = useState<string[]>([]);
  const [qaSteps, setQaSteps] = useState([
    { id: 1, desc: 'Initialize Webdriver and Grid', status: 'pending' },
    { id: 2, desc: 'Execute /login OAuth Checks', status: 'pending' },
    { id: 3, desc: 'Add Items to Cart (Dynamic Wait)', status: 'pending' },
    { id: 4, desc: 'Validate Payment Gateway Callback', status: 'pending' }
  ]);
  const [qaBrowser, setQaBrowser] = useState<'chrome' | 'firefox' | 'safari'>('chrome');
  const qaIntervalRef = useRef<any>(null);

  // 3. PyInsight sales forecasting states
  const [forecastAlgo, setForecastAlgo] = useState<'arima' | 'prophet' | 'lstm'>('prophet');
  const [demandFactor, setDemandFactor] = useState(3);
  const [marketingBudget, setMarketingBudget] = useState(25000);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // 4. OmniRetail BI Dashboard States
  const [biRegion, setBiRegion] = useState<'all' | 'east' | 'west' | 'north' | 'south'>('all');
  const [biCategory, setBiCategory] = useState<'all' | 'electronics' | 'apparel' | 'groceries'>('all');

  // 5. DevConnect MERN Stack States
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [authorName, setAuthorName] = useState('');

  // 6. Aegis Cybersecurity Scan States
  const [cyberScanning, setCyberScanning] = useState(false);
  const [cyberProgress, setCyberProgress] = useState(0);
  const [cyberLogs, setCyberLogs] = useState<string[]>([]);
  const [cyberThreatLevel, setCyberThreatLevel] = useState<'low' | 'elevated' | 'critical'>('elevated');
  const [scannedIpsCount, setScannedIpsCount] = useState(0);
  const cyberIntervalRef = useRef<any>(null);

  // 7. QuickRun Smartphone Dispatch Tracker States
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'driving' | 'delayed' | 'delivered'>('idle');
  const [deliveryEta, setDeliveryEta] = useState(28);
  const [deliveryPathPos, setDeliveryPathPos] = useState(10);
  const pathAnimationRef = useRef<any>(null);

  // 8. Custom / Dynamic Sandbox States (For newly added user projects)
  const [dynamicMethod, setDynamicMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [dynamicPath, setDynamicPath] = useState('/api/v1/resource');
  const [dynamicBody, setDynamicBody] = useState(
    JSON.stringify({ action: "query", params: { limit: 5 } }, null, 2)
  );
  const [dynamicResponse, setDynamicResponse] = useState<any>(null);
  const [dynamicLoading, setDynamicLoading] = useState(false);
  const [dynamicDbRows, setDynamicDbRows] = useState<any[]>([
    { id: 1, key: "database_latency", value: "3ms", status: "OPTIMAL" },
    { id: 2, key: "ssl_handshake", value: "TLS_1.3_AES_256", status: "SECURE" },
    { id: 3, key: "container_status", value: "Docker_Node_Active", status: "ACTIVE" }
  ]);
  const [dynamicTerminalLogs, setDynamicTerminalLogs] = useState<string[]>([
    "[SYSTEM] Bootstrapping custom sandbox containers...",
    "[NET] Port 8080 successfully mapped to public gateway",
    "[DB] Connected to database cluster successfully",
    "[READY] Listening for incoming API request payloads..."
  ]);
  const [dynamicNewKey, setDynamicNewKey] = useState('');
  const [dynamicNewVal, setDynamicNewVal] = useState('');
  const [dynamicNewStatus, setDynamicNewStatus] = useState('ACTIVE');

  // Timestamp and log logging helpers for simulator network inspector
  const getFormattedTime = (delayMs = 0) => {
    const date = new Date(Date.now() - delayMs);
    const hrs = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    const secs = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${hrs}:${mins}:${secs}.${ms}`;
  };

  const addInspectorLog = (method: string, url: string, status: number, statusText: string, payload?: any, response?: any) => {
    setInspectorLogs(prev => [
      ...prev,
      {
        timestamp: getFormattedTime(),
        method,
        url,
        status,
        statusText,
        payload,
        response
      }
    ]);
  };

  // Sync address URL and network logs on project load
  useEffect(() => {
    if (project) {
      if (project.id === 'java-banking-system') setAddressUrl('https://trustnet-bank.appteknow.site/dashboard');
      else if (project.id === 'testing-ecom-suite') setAddressUrl('https://apex-qa.appteknow.site/automation-runner');
      else if (project.id === 'python-retail-dashboard') setAddressUrl('https://pyinsight.appteknow.site/inventory-forecast');
      else if (project.id === 'data-analytics-omni') setAddressUrl('https://omniretail-analytics.appteknow.site/powerbi-reports');
      else if (project.id === 'mern-dev-network') setAddressUrl('https://devconnect-saas.appteknow.site/home');
      else if (project.id === 'cyber-threat-engine') setAddressUrl('https://aegis-shield.appteknow.site/sec-operations');
      else if (project.id === 'logistics-delivery-system') setAddressUrl('https://quickrun-dispatch.appteknow.site/map-live');
      else setAddressUrl(`https://${project.id}.appteknow.site`);

      // Seed realistic initial logs matching project tech stack
      const initialLogsMap: Record<string, any[]> = {
        'java-banking-system': [
          { timestamp: getFormattedTime(120), method: 'GET', url: '/api/v1/auth/session', status: 200, statusText: 'OK', response: { authenticated: true, user: 'sabeer.f@okaxis', role: 'PREMIUM_MEMBER' } },
          { timestamp: getFormattedTime(80), method: 'GET', url: '/api/v1/accounts/ledger?limit=3', status: 200, statusText: 'OK', response: { balance: 548250.00, currency: 'INR', logs: INITIAL_TRANSACTIONS } }
        ],
        'testing-ecom-suite': [
          { timestamp: getFormattedTime(100), method: 'GET', url: '/api/v1/automation/config', status: 200, statusText: 'OK', response: { gridActive: true, nodesAvailable: ['chrome', 'firefox', 'safari'], testPathsCount: 4 } }
        ],
        'python-retail-dashboard': [
          { timestamp: getFormattedTime(100), method: 'GET', url: '/api/v1/analytics/models', status: 200, statusText: 'OK', response: { activeModel: 'sarimax', features: ['marketing_budget', 'demand_factor'], lastTrained: '2026-05-20T12:00:00Z' } }
        ],
        'data-analytics-omni': [
          { timestamp: getFormattedTime(100), method: 'GET', url: '/api/v1/bi/schema', status: 200, statusText: 'OK', response: { dialect: 'sqlite', table: 'transactions', rowsIndexed: 14890, metrics: ['gross_sales', 'conversion', 'inventory'] } }
        ],
        'mern-dev-network': [
          { timestamp: getFormattedTime(100), method: 'GET', url: '/api/posts', status: 200, statusText: 'OK', response: { count: 2, posts: INITIAL_POSTS } }
        ],
        'cyber-threat-engine': [
          { timestamp: getFormattedTime(100), method: 'GET', url: '/api/sec/status', status: 200, statusText: 'OK', response: { scannerStatus: 'STANDBY', databaseSignatureVersion: 'v4.1.9', integrityCheck: 'PASS' } }
        ],
        'logistics-delivery-system': [
          { timestamp: getFormattedTime(100), method: 'GET', url: '/api/dispatch/routing/status', status: 200, statusText: 'OK', response: { activeVehicles: 1, baseCoordinates: [12.9166, 77.6101], landmarkNodes: BANGALORE_LANDMARKS } }
        ]
      };
      setInspectorLogs(initialLogsMap[project.id] || []);
    }
  }, [projectId, project]);

  // Clean intervals on unmount
  useEffect(() => {
    return () => {
      if (qaIntervalRef.current) clearInterval(qaIntervalRef.current);
      if (cyberIntervalRef.current) clearInterval(cyberIntervalRef.current);
      if (pathAnimationRef.current) clearInterval(pathAnimationRef.current);
    };
  }, []);

  if (!project) {
    return (
      <div className="container text-center section-padding" style={{ minHeight: '70vh', color: '#f8fafc' }}>
        <h2 style={{ color: '#ef4444' }}>Simulation Target Unresolved</h2>
        <p className="mt-3">The project sandbox you are trying to launch could not be index-located.</p>
        <Link to="/" className="btn btn-primary mt-4">Return to Hub</Link>
      </div>
    );
  }

  const handleSendDynamicRequest = () => {
    setDynamicLoading(true);
    
    // Parse body safely
    let parsedBody: any = null;
    if (dynamicMethod !== 'GET') {
      try {
        parsedBody = JSON.parse(dynamicBody);
      } catch (e) {
        parsedBody = { error: "Malformed JSON payload input" };
      }
    }

    const endpoint = dynamicPath;
    const method = dynamicMethod;

    // Simulate database update logic if it is POST or PUT
    if ((method === 'POST' || method === 'PUT') && parsedBody && parsedBody.key && parsedBody.value) {
      const nextId = dynamicDbRows.length + 1;
      const newRow = {
        id: nextId,
        key: parsedBody.key.toString(),
        value: parsedBody.value.toString(),
        status: parsedBody.status ? parsedBody.status.toString() : 'ACTIVE'
      };
      setDynamicDbRows(prev => [...prev, newRow]);
    }

    // Dynamic response generation
    let simulatedResponse: any = {};
    if (method === 'GET') {
      simulatedResponse = {
        status: "success",
        timestamp: new Date().toISOString(),
        query_path: endpoint,
        payload: {
          project_title: project.title,
          student: project.studentName,
          active_stack: project.techStack,
          database_records: dynamicDbRows
        }
      };
    } else if (method === 'POST') {
      simulatedResponse = {
        status: "created",
        txId: `tx-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `Resource created successfully for ${project.studentName}'s portal`,
        body: parsedBody
      };
    } else if (method === 'PUT') {
      simulatedResponse = {
        status: "updated",
        timestamp: new Date().toISOString(),
        message: "Resource modified in relational memory pool",
        body: parsedBody
      };
    } else {
      simulatedResponse = {
        status: "deleted",
        timestamp: new Date().toISOString(),
        message: "Target resource unlinked from active memory cluster"
      };
    }

    setTimeout(() => {
      setDynamicLoading(false);
      setDynamicResponse(simulatedResponse);
      
      // Log to Bottom Inspector console
      addInspectorLog(method, endpoint, method === 'POST' ? 201 : 200, method === 'POST' ? 'Created' : 'OK', parsedBody, simulatedResponse);
      
      // Log to terminal logs
      setDynamicTerminalLogs(prev => [
        ...prev,
        `[API] Received ${method} request to ${endpoint}`,
        `[SYS] Executing query logic: ${project.challengesSolved}`,
        `[DB] Cache lookup completed. Serialization code status: 200 OK`
      ]);
    }, 600);
  };

  const handleAddDbRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dynamicNewKey || !dynamicNewVal) return;
    const nextId = dynamicDbRows.length + 1;
    const newRow = {
      id: nextId,
      key: dynamicNewKey,
      value: dynamicNewVal,
      status: dynamicNewStatus
    };
    setDynamicDbRows(prev => [...prev, newRow]);
    setDynamicNewKey('');
    setDynamicNewVal('');
    
    setDynamicTerminalLogs(prev => [
      ...prev,
      `[DB] Manual transaction committed. Inserted row ${nextId} with key: "${dynamicNewKey}"`
    ]);

    addInspectorLog('POST', `/api/v1/db/insert-row`, 201, 'Created', newRow, { success: true, insertedId: nextId });
  };

  // Refresh handler simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    addInspectorLog('GET', `/api/v1/sandbox/reload?projectId=${project.id}`, 200, 'OK', null, { status: 'reloaded', timestamp: new Date().toISOString() });
    
    setTimeout(() => {
      setIsRefreshing(false);
      // Reset some states for fresh simulation visual feel
      if (project.id === 'testing-ecom-suite') {
        setQaProgress(0);
        setQaRunning(false);
        setQaLogs([]);
        setQaSteps(steps => steps.map(s => ({ ...s, status: 'pending' })));
      }
      if (project.id === 'cyber-threat-engine') {
        setCyberProgress(0);
        setCyberScanning(false);
        setCyberLogs([]);
      }
      if (project.id === 'logistics-delivery-system') {
        setDeliveryStatus('idle');
        setDeliveryPathPos(10);
        setDeliveryEta(28);
      }
    }, 800);
  };

  // 1. JAVA BANKING SYSTEM ACTIONS
  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(sendAmount);
    if (!recipient || isNaN(amt) || amt <= 0 || amt > bankBalance) {
      alert('Please input a valid transfer amount matching your active ledger balance.');
      return;
    }

    setBankSending(true);
    setBankSuccessMsg(false);
    
    // Log POST transaction trigger
    addInspectorLog('POST', '/api/v1/transactions/transfer', 202, 'Accepted', 
      { recipientUpi: recipient, amount: amt, senderUpi: 'sabeer.f@okaxis' }, 
      { status: 'PROCESSING', message: 'Transaction queued in Spring Boot Ledger Engine' }
    );

    setTimeout(() => {
      setBankSending(false);
      setBankBalance(prev => prev - amt);
      const newTx = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'transfer',
        description: `Transfer to ${recipient}`,
        amount: amt,
        status: 'Completed',
        date: 'Just now'
      };
      setBankTransactions(prev => [newTx, ...prev]);
      setRecipient('');
      setSendAmount('');
      setBankSuccessMsg(true);
      
      // Log successful transaction completion and ledger read sync
      addInspectorLog('POST', '/api/v1/transactions/transfer', 201, 'Created', 
        { recipientUpi: recipient, amount: amt, senderUpi: 'sabeer.f@okaxis' }, 
        { txId: newTx.id, status: 'COMPLETED', committedAt: new Date().toISOString() }
      );
      addInspectorLog('GET', '/api/v1/accounts/ledger?limit=3', 200, 'OK', null, 
        { balance: bankBalance - amt, transactions: [newTx, ...bankTransactions] }
      );

      setTimeout(() => setBankSuccessMsg(false), 4000);
    }, 1200);
  };

  // 2. SELENIUM TEST SUITE ACTIONS
  const handleRunQaTests = () => {
    if (qaRunning) return;
    setQaRunning(true);
    setQaProgress(0);
    setQaLogs(['[INFO] Launching Selenium Grid Server locally...', `[INFO] Spawning Webdriver instance for ${qaBrowser.toUpperCase()}...`]);
    setQaSteps(steps => steps.map(s => ({ ...s, status: 'pending' })));

    addInspectorLog('POST', '/api/v1/automation/run', 202, 'Accepted', 
      { browser: qaBrowser, suite: 'Checkout E2E' }, 
      { jobId: 'job-7801', status: 'IN_PROGRESS' }
    );

    let stepProgress = 0;

    if (qaIntervalRef.current) clearInterval(qaIntervalRef.current);

    qaIntervalRef.current = setInterval(() => {
      stepProgress += 5;
      setQaProgress(stepProgress);

      if (stepProgress === 10) {
        setQaSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'running' } : s));
        setQaLogs(prev => [...prev, '[DEBUG] Grid connected. Routing requests to cloud node...', '[PASS] Grid initialized successfully.']);
        addInspectorLog('WS', 'ws://localhost:4444/grid', 200, 'Connected', 
          { action: 'INITIALIZE', browser: qaBrowser }, 
          { gridStatus: 'ONLINE', activeSessionId: '9a2f-11ed-bdc4' }
        );
      } else if (stepProgress === 25) {
        setQaSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'pass' } : i === 1 ? { ...s, status: 'running' } : s));
        setQaLogs(prev => [...prev, '[INFO] Navigating to http://localhost:8080/auth/login', '[DEBUG] Populating credentials and firing submission...', '[PASS] JWT session captured. Session persistent.']);
        addInspectorLog('POST', '/session/9a2f-11ed-bdc4/url', 200, 'OK', 
          { url: 'http://localhost:8080/auth/login' }, 
          { status: 'success' }
        );
      } else if (stepProgress === 50) {
        setQaSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'pass' } : i === 2 ? { ...s, status: 'running' } : s));
        setQaLogs(prev => [...prev, '[INFO] Triggering cart add logic for dynamic item code #4910', '[DEBUG] Active element wait triggered...', '[PASS] Dynamic AJAX button element found and clicked. Cart updated.']);
        addInspectorLog('POST', '/session/9a2f-11ed-bdc4/element', 200, 'OK', 
          { using: 'css selector', value: '#btn-checkout' }, 
          { elementId: 'elem-checkout-49a' }
        );
      } else if (stepProgress === 75) {
        setQaSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'pass' } : i === 3 ? { ...s, status: 'running' } : s));
        setQaLogs(prev => [...prev, '[INFO] Loading Stripe callback handler test route...', '[DEBUG] Injecting simulated success token...', '[PASS] DB verify check completed. Checkout finalized successfully.']);
        addInspectorLog('POST', '/session/9a2f-11ed-bdc4/element/elem-checkout-49a/click', 200, 'OK', 
          {}, 
          { status: 'success' }
        );
      } else if (stepProgress >= 100) {
        setQaProgress(100);
        setQaRunning(false);
        setQaSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: 'pass' } : s));
        setQaLogs(prev => [...prev, '[SUCCESS] All 4 E2E automated test flows executed successfully!', `[REPORT] Total execution time: 4.87s on browser node ${qaBrowser.toUpperCase()}.`]);
        addInspectorLog('GET', '/api/v1/automation/report/job-7801', 200, 'OK', null, 
          { passed: true, totalTests: 4, durationSeconds: 4.87, browser: qaBrowser }
        );
        if (qaIntervalRef.current) clearInterval(qaIntervalRef.current);
      }
    }, 200);
  };

  // 3. PYINSIGHT CALCULATOR SIMULATION
  const handleCalculateForecast = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      addInspectorLog('POST', '/api/v1/analytics/forecast', 200, 'OK', 
        { algorithm: forecastAlgo, demandMultiplier: demandFactor, marketingBudget: marketingBudget }, 
        { status: 'success', forecastAccuracy: forecastAlgo === 'lstm' ? '96.8%' : forecastAlgo === 'prophet' ? '94.2%' : '88.5%', pointsCount: 5 }
      );
    }, 1000);
  };



  // 4. OMNIRETAIL DYNAMIC SALES KPI
  const getBiMetrics = () => {
    let sales = 849200;
    let conversion = 4.2;
    let items = 14890;

    if (biRegion === 'east') { sales *= 0.28; conversion = 3.9; items = 4120; }
    else if (biRegion === 'west') { sales *= 0.32; conversion = 4.6; items = 4850; }
    else if (biRegion === 'north') { sales *= 0.18; conversion = 3.5; items = 2500; }
    else if (biRegion === 'south') { sales *= 0.22; conversion = 4.4; items = 3420; }

    if (biCategory === 'electronics') { sales *= 0.6; conversion *= 0.8; items *= 0.4; }
    else if (biCategory === 'apparel') { sales *= 0.25; conversion *= 1.2; items *= 0.35; }
    else if (biCategory === 'groceries') { sales *= 0.15; conversion *= 1.5; items *= 0.25; }

    return {
      sales: Math.floor(sales).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      conversion: conversion.toFixed(1) + '%',
      items: Math.floor(items).toLocaleString('en-IN')
    };
  };

  // 5. DEVCONNECT POST ACTIONS
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost = {
      id: Date.now(),
      author: authorName.trim() || 'Anonymous Developer',
      role: 'AppTeknow Graduate',
      content: newPostText.trim(),
      likes: 0,
      date: 'Just now'
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setAuthorName('');

    addInspectorLog('POST', '/api/posts', 201, 'Created', 
      { author: newPost.author, content: newPost.content, role: newPost.role }, 
      { _id: newPost.id, success: true, timestamp: new Date().toISOString() }
    );
  };

  // 6. AEGIS CYBERSECURITY SCAN ACTIONS
  const handleCyberScan = () => {
    if (cyberScanning) return;
    setCyberScanning(true);
    setCyberProgress(0);
    setScannedIpsCount(0);
    setCyberLogs([
      '[SYS] Initializing Aegis Threat Scraper engine...',
      '[PORT] Beginning port sweep across subnet 192.168.1.0/24...'
    ]);

    addInspectorLog('POST', '/api/sec/scan/launch', 202, 'Accepted', 
      { subnet: '192.168.1.0/24' }, 
      { scanId: 'scan-4910', status: 'IN_PROGRESS' }
    );

    let prg = 0;
    if (cyberIntervalRef.current) clearInterval(cyberIntervalRef.current);

    cyberIntervalRef.current = setInterval(() => {
      prg += 10;
      setCyberProgress(prg);
      setScannedIpsCount(prev => prev + 24);

      if (prg === 20) {
        setCyberLogs(prev => [...prev, '[WARN] Subnet host 192.168.1.14 responding with filtered ping.', '[PORT] Port 80 (HTTP) [OPEN]', '[PORT] Port 22 (SSH) [OPEN]']);
        addInspectorLog('GET', '/api/sec/scan/scan-4910/hosts', 200, 'OK', null, 
          { hostsDiscovered: 4, openPorts: [22, 80] }
        );
      } else if (prg === 50) {
        setCyberLogs(prev => [...prev, '[ALERT] Subnet host 192.168.1.87 has port 3389 (RDP) [VULNERABLE] to CVE-2019-0708', '[SYS] Sniffing SSL packets on active network interface...']);
        setCyberThreatLevel('critical');
        addInspectorLog('GET', '/api/sec/scan/scan-4910/alerts', 200, 'OK', null, 
          { threatLevel: 'CRITICAL', vulnerability: 'CVE-2019-0708 RDP exposed' }
        );
      } else if (prg === 80) {
        setCyberLogs(prev => [...prev, '[PORT] Port 8080 (TCP) [CLOSED]', '[INFO] Packets analyzed: 1,489. Normal indicators detected.']);
      } else if (prg >= 100) {
        setCyberProgress(100);
        setCyberScanning(false);
        setCyberLogs(prev => [
          ...prev,
          '[SUCCESS] Network penetration assessment completed.',
          `[SUMMARY] 254 active IPs checked. 1 critical vulnerability flag. Threat level locked.`
        ]);
        addInspectorLog('GET', '/api/sec/scan/scan-4910/report', 200, 'OK', null, 
          { hostsScanned: 254, activeIPs: 24, vulnerabilityCount: 1, threatIndex: 'critical' }
        );
        if (cyberIntervalRef.current) clearInterval(cyberIntervalRef.current);
      }
    }, 300);
  };

  // 7. QUICKRUN LOGISTICS DISPATCH ACTIONS
  const handleStartDelivery = () => {
    if (deliveryStatus === 'driving' || deliveryStatus === 'delivered') return;
    setDeliveryStatus('driving');
    setDeliveryPathPos(10);
    setDeliveryEta(28);

    addInspectorLog('POST', '/api/dispatch/launch', 202, 'Accepted', 
      { route: 'btm_hub-silk_board-koramangala_4th-accenture_corp', vehicle: 'HR-26-CV-4109', driver: 'Rahul Verma' }, 
      { trackingId: 'TRK-9812', status: 'driving', eta: 28 }
    );

    if (pathAnimationRef.current) clearInterval(pathAnimationRef.current);

    pathAnimationRef.current = setInterval(() => {
      setDeliveryPathPos(pos => {
        if (pos % 20 === 0 && pos < 100) {
          addInspectorLog('WS', 'ws://quickrun-dispatch.appteknow.site/live', 200, 'OK', 
            { trackingId: 'TRK-9812', progress: pos, coordinates: [12.9176, 77.6231] }, 
            { acknowledgement: 'RECEIVED' }
          );
        }

        if (pos >= 100) {
          setDeliveryStatus('delivered');
          setDeliveryEta(0);
          addInspectorLog('PUT', '/api/dispatch/tracking/TRK-9812/delivered', 200, 'OK', 
            { handoffRequired: false }, 
            { status: 'delivered', completedAt: new Date().toISOString() }
          );
          if (pathAnimationRef.current) clearInterval(pathAnimationRef.current);
          return 100;
        }
        
        // Update mock ETA based on progression
        setDeliveryEta(Math.max(1, Math.floor(28 - (28 * (pos / 100)))));
        return pos + 5;
      });
    }, 400);
  };

  const handleSimulateDelay = () => {
    if (deliveryStatus !== 'driving') return;
    setDeliveryStatus('delayed');
    setDeliveryEta(prev => prev + 15);
    addInspectorLog('PUT', '/api/dispatch/tracking/TRK-9812/alert', 200, 'OK', 
      { alertType: 'TRAFFIC_JAM', localization: 'Silk Board Junction' }, 
      { status: 'delayed', extraDelayMins: 15, updatedEta: deliveryEta + 15 }
    );
  };

  return (
    <>
      <SEO 
        title={`${project.title} - Live Demonstration Sandbox | AppTeknow Careers`} 
        description={`Direct live application simulation of the capstone project engineered by ${project.studentName}.`}
      />

      <div className="sandbox-wrapper">
        
        {/* TOP STATUS HUB / BACK NAVIGATION */}
        <div className="sandbox-nav-header">
          <div className="container flex-between">
            <Link to={`/replica-project/${project.id}`} className="sandbox-back-link">
              <ArrowLeft size={16} /> Back to Case Study Snapshot
            </Link>
            <div className="sandbox-info-badge">
              <span>Interactive Simulator: <strong>{project.studentName}</strong> (Placed at {project.placedCompany})</span>
            </div>
          </div>
        </div>

        {/* CORE SIMULATED BROWSER CHASSIS */}
        <div className="container sandbox-container-main">
          <div className="browser-mockup">
            
            {/* BROWSER TOP BAR (TABS + WINDOW CONTROLS) */}
            <div className="browser-top-bar">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              
              <div className="browser-tabs">
                <div 
                  className={`browser-tab ${activeView === 'preview' ? 'active-browser-tab' : ''}`}
                  onClick={() => setActiveView('preview')}
                >
                  <Globe size={13} className="mr-1" /> {project.title} Preview
                </div>
                <div 
                  className={`browser-tab ${activeView === 'code' ? 'active-browser-tab' : ''}`}
                  onClick={() => setActiveView('code')}
                >
                  <Terminal size={13} className="mr-1" /> View Source Code
                </div>
              </div>
            </div>

            {/* BROWSER CONTROLS BAR (NAVBAR ADDRESS) */}
            <div className="browser-address-bar">
              <div className="browser-nav-buttons">
                <button className="nav-arrow" disabled>&larr;</button>
                <button className="nav-arrow" disabled>&rarr;</button>
                <button className={`nav-refresh ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
                  <RefreshCw size={13} />
                </button>
              </div>
              
              <div className="address-input-wrapper">
                <Lock size={12} className="secure-lock-icon" />
                <span className="address-text">{addressUrl}</span>
              </div>

              <div className="address-ssl-badge">
                <LockKeyhole size={11} className="mr-1" /> Secure SSL (Mock Sandbox)
              </div>
            </div>

            {/* BROWSER VIEWPORT CONTAINER */}
            <div className={`browser-viewport ${isRefreshing ? 'loading-refresh' : ''}`}>
              {isRefreshing ? (
                <div className="viewport-loader">
                  <div className="glowing-spinner"></div>
                  <p>Reloading local simulated environment containers...</p>
                </div>
              ) : activeView === 'code' ? (
                (() => {
                  const sourceFile = isPredefinedProject(project.id)
                    ? MOCK_SOURCE_FILES[project.id]
                    : getDynamicSourceCode(project);
                  return (
                    <div className="ide-workspace">
                      <div className="ide-sidebar">
                        <div className="sidebar-header">Workspace</div>
                        <div className="file-item active">
                          <span className="file-icon">📄</span>
                          <span className="file-name">{sourceFile?.filename || 'Source.code'}</span>
                        </div>
                      </div>
                      <div className="ide-editor-area">
                        <div className="ide-editor-header">
                          <div className="ide-tab active">
                            {sourceFile?.filename || 'Source.code'}
                          </div>
                        </div>
                        <div className="ide-code-container font-mono">
                          {tokenizeAndHighlight(sourceFile?.code || '')}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="simulation-canvas">

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 1. JAVA CORE BANKING SYSTEM PREVIEW */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {project.id === 'java-banking-system' && (
                    <div className="bank-dashboard">
                      
                      {/* Left: Financial Balances */}
                      <div className="bank-row">
                        <div className="bank-card balance-card">
                          <div className="flex-between">
                            <span className="card-lbl">Available Balance (INR)</span>
                            <span className="secure-tag"><ShieldCheck size={14} /> Shield Guarded</span>
                          </div>
                          <h2 className="bank-balance">₹{bankBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                          
                          <div className="bank-microservices-status">
                            <div className="status-header">
                              <Cpu size={14} /> Microservices Orchestration
                            </div>
                            <div className="services-grid">
                              <div className="svc-badge">Auth Server <span className="light green"></span></div>
                              <div className="svc-badge">Ledger Engine <span className="light green"></span></div>
                              <div className="svc-badge">Stripe Gate <span className="light green"></span></div>
                              <div className="svc-badge">
                                Latency <span className="ms-value">{bankLoadSpike ? '287ms' : '14ms'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Live Transaction Log */}
                        <div className="bank-card transaction-card">
                          <div className="flex-between mb-3 border-b pb-2 border-slate-700">
                            <h3>Ledger Logs (PostgreSQL Sync)</h3>
                            <button 
                              onClick={() => setBankLoadSpike(!bankLoadSpike)} 
                              className={`btn btn-xs ${bankLoadSpike ? 'btn-accent' : 'btn-outline-light'}`}
                              style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                            >
                              {bankLoadSpike ? 'Reset Latency' : 'Simulate Load Spike'}
                            </button>
                          </div>
                          <div className="tx-list">
                            {bankTransactions.map(tx => (
                              <div className="tx-item flex-between" key={tx.id}>
                                <div>
                                  <div className="tx-desc">{tx.description}</div>
                                  <div className="tx-meta">{tx.id} · {tx.date}</div>
                                </div>
                                <div className={`tx-amt ${tx.type}`}>
                                  {tx.type === 'transfer' ? '-' : '+'}${(tx.amount).toLocaleString('en-IN')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Form: Send simulated transfer */}
                      <div className="bank-card transfer-action-card mt-3">
                        <h3>Simulate Spring Boot REST Middleware POST Request</h3>
                        <p className="subtext">Submit a mock transaction to verify state management and database synchronization protocols.</p>
                        
                        {bankSuccessMsg && (
                          <div className="sandbox-success-alert flex-center">
                            <CheckCircle2 size={16} className="mr-1" /> Core Banking transaction processed and committed to SQLite successfully!
                          </div>
                        )}

                        <form onSubmit={handleSendMoney} className="transfer-form">
                          <input 
                            type="text" 
                            placeholder="Recipient UPI ID / A/C Name" 
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                          />
                          <input 
                            type="number" 
                            placeholder="Amount in INR" 
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            required
                            min="1"
                          />
                          <button type="submit" className="btn btn-primary" disabled={bankSending}>
                            {bankSending ? 'Executing REST POST...' : 'Execute Secure Transfer'} <Send size={14} className="ml-1" />
                          </button>
                        </form>
                      </div>

                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 2. AUTOMATION TESTING E2E RUNNER PREVIEW */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {project.id === 'testing-ecom-suite' && (
                    <div className="qa-workspace">
                      
                      {/* Left: Terminal output */}
                      <div className="qa-grid">
                        <div className="qa-card terminal-card">
                          <div className="terminal-header flex-between">
                            <span className="flex-center gap-1"><Terminal size={14} /> Selenium Grid Console</span>
                            <span className="status-text">{qaRunning ? 'RUNNING INTEGRATIONS...' : 'STANDBY'}</span>
                          </div>
                          
                          <div className="terminal-body font-mono">
                            {qaLogs.length === 0 ? (
                              <div className="terminal-placeholder">
                                <p>&gt; System ready to receive test runner triggers.</p>
                                <p>&gt; Select node target environment and hit "Execute Suite".</p>
                              </div>
                            ) : (
                              qaLogs.map((log, idx) => (
                                <div key={idx} className={`log-line ${log.includes('[PASS]') ? 'pass' : log.includes('[SUCCESS]') ? 'success' : log.includes('[DEBUG]') ? 'debug' : ''}`}>
                                  {log}
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Right: UI step progress */}
                        <div className="qa-card suite-controls-card">
                          <h3>Cucumber E2E Test Suite Configurations</h3>
                          
                          <div className="qa-config-row">
                            <label>Webdriver Node:</label>
                            <div className="browser-selector flex">
                              {['chrome', 'firefox', 'safari'].map(b => (
                                <button 
                                  key={b} 
                                  className={`btn btn-xs ${qaBrowser === b ? 'btn-primary' : 'btn-outline-light'}`}
                                  onClick={() => !qaRunning && setQaBrowser(b as any)}
                                  disabled={qaRunning}
                                >
                                  {b.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="steps-checklist">
                            {qaSteps.map(step => (
                              <div className={`step-item flex-between ${step.status}`} key={step.id}>
                                <span className="step-desc">Step {step.id}: {step.desc}</span>
                                <span className={`step-status-pill ${step.status}`}>
                                  {step.status.toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>

                          {qaProgress > 0 && (
                            <div className="progress-bar-wrapper mt-3">
                              <div className="progress-bar-label flex-between">
                                <span>Automation Run Progression</span>
                                <span>{qaProgress}%</span>
                              </div>
                              <div className="progress-bar-track">
                                <div className="progress-fill" style={{ width: `${qaProgress}%` }}></div>
                              </div>
                            </div>
                          )}

                          <button 
                            onClick={handleRunQaTests} 
                            className="btn btn-primary btn-full-w mt-4 flex-center gap-1"
                            disabled={qaRunning}
                          >
                            <Play size={15} /> {qaRunning ? 'Executing Test Nodes...' : 'Execute Suite Pipeline'}
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 3. PYINSIGHT SALES ANALYTICS PREVIEW */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {project.id === 'python-retail-dashboard' && (
                    <div className="python-forecast-panel">
                      
                      <div className="python-grid">
                        {/* Parameters Sliders */}
                        <div className="bank-card parameter-card">
                          <h3>Django & Pandas Forecast Model Params</h3>
                          <p className="subtext">Tweak core model variables to recalculate sliding window regressions dynamically.</p>
                          
                          <div className="slider-item">
                            <div className="flex-between">
                              <label>Demand Weight Multiplier</label>
                              <span className="slider-val">{demandFactor}x</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="5" 
                              value={demandFactor} 
                              onChange={(e) => setDemandFactor(parseInt(e.target.value))}
                            />
                          </div>

                          <div className="slider-item">
                            <div className="flex-between">
                              <label>Mock Marketing Budget (INR)</label>
                              <span className="slider-val">₹{marketingBudget.toLocaleString('en-IN')}</span>
                            </div>
                            <input 
                              type="range" 
                              min="5000" 
                              max="50000" 
                              step="5000" 
                              value={marketingBudget} 
                              onChange={(e) => setMarketingBudget(parseInt(e.target.value))}
                            />
                          </div>

                          <div className="slider-item">
                            <label>Regression Algorithm</label>
                            <select 
                              value={forecastAlgo} 
                              onChange={(e) => setForecastAlgo(e.target.value as any)}
                              className="algo-select"
                            >
                              <option value="prophet">FB Prophet (Time Series)</option>
                              <option value="arima">Auto-ARIMA Linear</option>
                              <option value="lstm">LSTM Neural Network</option>
                            </select>
                          </div>

                          <button onClick={handleCalculateForecast} className="btn btn-primary btn-full-w flex-center gap-1">
                            <Sliders size={14} /> Calculate Regression
                          </button>
                        </div>

                        {/* Chart Render Canvas */}
                        <div className="bank-card chart-visualization-card" style={{ position: 'relative' }}>
                          <div className="flex-between mb-3">
                            <div>
                              <h3>Dynamic Predictive Plot</h3>
                              <span className="chart-algo-tag">{forecastAlgo.toUpperCase()} Model</span>
                            </div>
                            <div className="chart-metrics text-right">
                              <span className="lbl">Accuracy Index</span>
                              <span className="val">{forecastAlgo === 'lstm' ? '96.8%' : forecastAlgo === 'prophet' ? '94.2%' : '88.5%'}</span>
                            </div>
                          </div>

                          {/* Interactive Chart drawing using dynamic inline SVGs */}
                          <div className="svg-chart-container">
                            {isCalculating ? (
                              <div className="chart-recalculating">
                                <div className="glowing-spinner"></div>
                                <p>Processing Pandas frames...</p>
                              </div>
                            ) : (
                              <>
                                <svg viewBox="0 0 600 200" className="forecast-svg-graph">
                                  {/* Grid Lines */}
                                  <line x1="20" y1="20" x2="580" y2="20" stroke="#1e293b" />
                                  <line x1="20" y1="80" x2="580" y2="80" stroke="#1e293b" />
                                  <line x1="20" y1="140" x2="580" y2="140" stroke="#1e293b" />
                                  
                                  {/* Trend Curve */}
                                  <path 
                                    d={(() => {
                                      const basePoints = [
                                        { x: 50, y: 160 },
                                        { x: 150, y: 130 },
                                        { x: 250, y: 80 },
                                        { x: 350, y: 110 },
                                        { x: 450, y: 60 },
                                        { x: 550, y: 40 }
                                      ];
                                      const getAdjustedY = (yVal: number) => {
                                        const factor = (demandFactor * 12) + ((marketingBudget - 5000) / 45000) * 30;
                                        return Math.max(20, Math.min(180, yVal - factor));
                                      };
                                      return basePoints.map((p, idx) => {
                                        const adjY = getAdjustedY(p.y);
                                        return `${idx === 0 ? 'M' : 'L'} ${p.x} ${adjY}`;
                                      }).join(' ');
                                    })()} 
                                    fill="none" 
                                    stroke="#3b82f6" 
                                    strokeWidth="3.5" 
                                    strokeLinecap="round"
                                    className="trend-line-animation"
                                  />

                                  {/* Interactive Dot markers */}
                                  {(() => {
                                    const basePoints = [
                                      { x: 50, y: 160, month: 'June' },
                                      { x: 150, y: 130, month: 'July' },
                                      { x: 250, y: 80, month: 'August' },
                                      { x: 350, y: 110, month: 'September' },
                                      { x: 450, y: 60, month: 'October' },
                                      { x: 550, y: 40, month: 'November' }
                                    ];
                                    const getAdjustedY = (yVal: number) => {
                                      const factor = (demandFactor * 12) + ((marketingBudget - 5000) / 45000) * 30;
                                      return Math.max(20, Math.min(180, yVal - factor));
                                    };
                                    return basePoints.map((p, idx) => {
                                      const adjY = getAdjustedY(p.y);
                                      const value = Math.floor((200 - adjY) * 15 * demandFactor + (marketingBudget * 0.1));
                                      const confidence = 90 + Math.floor((200 - adjY) * 0.05) + (forecastAlgo === 'lstm' ? 3 : forecastAlgo === 'arima' ? -4 : 0);
                                      
                                      return (
                                        <circle
                                          key={idx}
                                          cx={p.x}
                                          cy={adjY}
                                          r={hoveredPoint?.idx === idx ? "8" : "5"}
                                          fill={hoveredPoint?.idx === idx ? "#10b981" : "#3b82f6"}
                                          stroke="#fff"
                                          strokeWidth="2"
                                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                          onMouseEnter={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const containerRect = e.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect();
                                            if (containerRect) {
                                              setHoveredPoint({
                                                idx,
                                                month: p.month,
                                                demand: value,
                                                confidence: Math.min(99, confidence),
                                                x: rect.left - containerRect.left + 15,
                                                y: rect.top - containerRect.top - 65
                                              });
                                            }
                                          }}
                                          onMouseLeave={() => setHoveredPoint(null)}
                                        />
                                      );
                                    });
                                  })()}
                                </svg>
                                {hoveredPoint && (
                                  <div 
                                    className="forecast-tooltip" 
                                    style={{ 
                                      position: 'absolute', 
                                      left: `${hoveredPoint.x}px`, 
                                      top: `${hoveredPoint.y}px`,
                                      zIndex: 100,
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <div className="tooltip-month">{hoveredPoint.month} Forecast</div>
                                    <div className="tooltip-row">
                                      <span className="tooltip-lbl">Projected Demand:</span>
                                      <span className="tooltip-val">₹{hoveredPoint.demand.toLocaleString('en-IN')} units</span>
                                    </div>
                                    <div className="tooltip-row">
                                      <span className="tooltip-lbl">Confidence:</span>
                                      <span className="tooltip-val text-emerald-400">{hoveredPoint.confidence}%</span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 4. OMNIRETAIL BI DASHBOARD PREVIEW */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {project.id === 'data-analytics-omni' && (
                    <div className="bi-dashboard-container">
                      
                      {/* Controls ribbon */}
                      <div className="bi-controls-ribbon flex-between">
                        <div className="flex gap-2">
                          <span className="flex-center font-semibold text-slate-400 gap-1"><Filter size={14} /> Region:</span>
                          {['all', 'east', 'west', 'north', 'south'].map(reg => (
                            <button 
                              key={reg} 
                              className={`btn btn-xs ${biRegion === reg ? 'btn-primary' : 'btn-outline-light'}`}
                              onClick={() => setBiRegion(reg as any)}
                            >
                              {reg.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <span className="flex-center font-semibold text-slate-400 gap-1"><Layers size={14} /> Category:</span>
                          {['all', 'electronics', 'apparel', 'groceries'].map(cat => (
                            <button 
                              key={cat} 
                              className={`btn btn-xs ${biCategory === cat ? 'btn-accent' : 'btn-outline-light'}`}
                              onClick={() => setBiCategory(cat as any)}
                            >
                              {cat.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sales metrics grids */}
                      <div className="bi-metrics-grid mt-3">
                        <div className="bi-card">
                          <span className="lbl">Gross Sales Pipeline</span>
                          <h2>{getBiMetrics().sales}</h2>
                          <span className="stat trend-up">🏆 High Target</span>
                        </div>
                        <div className="bi-card">
                          <span className="lbl">Customer Conversion Rate</span>
                          <h2>{getBiMetrics().conversion}</h2>
                          <span className="stat">Normalized</span>
                        </div>
                        <div className="bi-card">
                          <span className="lbl">Active Inventory Units</span>
                          <h2>{getBiMetrics().items}</h2>
                          <span className="stat">SQLite Dynamic Sync</span>
                        </div>
                      </div>

                      {/* Mock visual analytics table */}
                      <div className="bi-data-table mt-3">
                        <div className="flex-between mb-2">
                          <h4>Stock & Delivery Health Indexes</h4>
                          <span className="flex-center text-xs text-slate-400 gap-1"><Database size={12} /> Live Power BI Embed Simulator</span>
                        </div>
                        
                        <div className="table-responsive">
                          <table className="mini-data-grid">
                            <thead>
                              <tr>
                                <th>Ecosystem SKU</th>
                                <th>Target Category</th>
                                <th>Region Segment</th>
                                <th>Demand Velocity</th>
                                <th>Status Alert</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>ELE-8902-BLR</td>
                                <td>Electronics</td>
                                <td>{biRegion === 'all' ? 'East' : biRegion.toUpperCase()}</td>
                                <td>High Priority</td>
                                <td><span className="badge-status green">In Stock</span></td>
                              </tr>
                              <tr>
                                <td>APP-4100-MUM</td>
                                <td>Apparel</td>
                                <td>{biRegion === 'all' ? 'West' : biRegion.toUpperCase()}</td>
                                <td>Medium</td>
                                <td><span className="badge-status green">In Stock</span></td>
                              </tr>
                              <tr>
                                <td>GRO-1120-DEL</td>
                                <td>Groceries</td>
                                <td>{biRegion === 'all' ? 'North' : biRegion.toUpperCase()}</td>
                                <td>Rapid Velocity</td>
                                <td><span className="badge-status red">Restock Alert</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 5. DEVCONNECT MERN STACK PREVIEW (NEW #5) */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {project.id === 'mern-dev-network' && (
                    <div className="mern-workspace">
                      
                      <div className="mern-grid">
                        {/* Feed section */}
                        <div className="mern-card feed-column">
                          <h3>Developer Community Feed</h3>
                          <div className="posts-list mt-3">
                            {posts.map(post => (
                              <div className="post-card" key={post.id}>
                                <div className="post-header flex-between">
                                  <div>
                                    <span className="post-author">{post.author}</span>
                                    <span className="post-role">{post.role}</span>
                                  </div>
                                  <span className="post-date">{post.date}</span>
                                </div>
                                <p className="post-content mt-2">{post.content}</p>
                                <div className="post-footer mt-2 flex">
                                  <button className="like-btn text-xs mr-4" onClick={() => {
                                    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                                  }}>
                                    👍 {post.likes} Likes
                                  </button>
                                  <span className="text-xs text-slate-500">💬 Comments (0)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Compose card */}
                        <div className="mern-card compose-column">
                          <h3>Publish a Dynamic Post</h3>
                          <p className="subtext">Simulate React state mapping and Node.js REST API push loops.</p>
                          
                          <form onSubmit={handleCreatePost} className="compose-form mt-3">
                            <input 
                              type="text" 
                              placeholder="Your Name (e.g. Sanjay Mehta)" 
                              value={authorName} 
                              onChange={(e) => setAuthorName(e.target.value)}
                              required
                            />
                            <textarea 
                              placeholder="Write your post content here... (e.g. Just optimized Express middleware!)" 
                              value={newPostText} 
                              onChange={(e) => setNewPostText(e.target.value)}
                              required
                              rows={4}
                            />
                            <button type="submit" className="btn btn-accent btn-full-w flex-center gap-1">
                              <Share2 size={14} /> Publish Post Live
                            </button>
                          </form>
                          
                          <div className="saas-meta mt-3">
                            <div className="flex-between">
                              <span className="text-xs text-slate-400">Database Sync:</span>
                              <span className="text-xs text-emerald-400 font-semibold flex-center gap-1"><Database size={11} /> MongoDB Connected</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 6. AEGIS CYBERSECURITY SCANNER PREVIEW (NEW #6) */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {project.id === 'cyber-threat-engine' && (
                    <div className="cyber-ops-dashboard">
                      
                      <div className="cyber-metrics mb-3">
                        <div className="metric-box">
                          <span className="lbl">Threat Mitigation Index</span>
                          <h3 className={`val ${cyberThreatLevel === 'critical' ? 'text-rose-500 font-bold' : 'text-amber-500'}`}>
                            {cyberThreatLevel.toUpperCase()}
                          </h3>
                        </div>
                        <div className="metric-box">
                          <span className="lbl">Network Hosts Checked</span>
                          <h3 className="val">{scannedIpsCount} / 254</h3>
                        </div>
                        <div className="metric-box">
                          <span className="lbl">IDS Engine Status</span>
                          <h3 className="val text-emerald-400 flex-center gap-1"><Activity size={14} /> SCRAPING LIVE</h3>
                        </div>
                      </div>

                      <div className="qa-grid">
                        {/* Threat scanning monitor terminal */}
                        <div className="qa-card terminal-card">
                          <div className="terminal-header flex-between">
                            <span className="flex-center gap-1"><Terminal size={14} /> BurpSuite / Scapy Scanner Shell</span>
                            <span className="status-text">{cyberScanning ? 'SWEEPING SUBNETS...' : 'SCAN STANDBY'}</span>
                          </div>
                          
                          <div className="terminal-body font-mono">
                            {cyberLogs.length === 0 ? (
                              <div className="terminal-placeholder">
                                <p>&gt; Aegis Threat Intelligence daemon active.</p>
                                <p>&gt; Click "Run Vulnerability Assessment Scan" to audit local router subnets.</p>
                              </div>
                            ) : (
                              cyberLogs.map((log, idx) => (
                                <div key={idx} className={`log-line ${log.includes('[ALERT]') ? 'alert' : log.includes('[WARN]') ? 'warn' : log.includes('[SUCCESS]') ? 'success' : ''}`}>
                                  {log}
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Scanner trigger panel */}
                        <div className="qa-card suite-controls-card text-center justify-center flex flex-col">
                          <h3>Subnet Auditing Panel</h3>
                          <p className="subtext mt-1 mb-4">Launches a multi-threaded simulated packet auditor querying local interface endpoints for standard port vulnerabilities.</p>
                          
                          {cyberProgress > 0 && (
                            <div className="progress-bar-wrapper mb-4 text-left">
                              <div className="progress-bar-label flex-between">
                                <span>Sweeping Subnet Blocks</span>
                                <span>{cyberProgress}%</span>
                              </div>
                              <div className="progress-bar-track">
                                <div className="progress-fill alert" style={{ width: `${cyberProgress}%`, background: '#ef4444' }}></div>
                              </div>
                            </div>
                          )}

                          <button 
                            onClick={handleCyberScan} 
                            className={`btn ${cyberScanning ? 'btn-outline-light' : 'btn-primary'} btn-lg flex-center gap-1`}
                            disabled={cyberScanning}
                          >
                            <ShieldCheck size={18} /> {cyberScanning ? 'Auditing Networks...' : 'Run Subnet Audit Scan'}
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 7. QUICKRUN LOGISTICS DISPATCH PREVIEW (NEW #7) */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {project.id === 'logistics-delivery-system' && (
                    <div className="logistics-workspace">
                      
                      <div className="logistics-grid">
                        
                        {/* Smartphone Screen Simulator mockup */}
                        <div className="smartphone-wrapper">
                          <div className="smartphone-case">
                            <div className="smartphone-notch"></div>
                            
                            {/* Smartphone contents */}
                            <div className="phone-screen bg-slate-900">
                              
                              {/* Header Map banner */}
                              <div className="map-banner flex-between">
                                <div className="flex-center gap-1"><Smartphone size={13} /> QuickRun Dispatch Mobile</div>
                                <span className={`status-tag ${deliveryStatus}`}>
                                  {deliveryStatus.toUpperCase()}
                                </span>
                              </div>

                              {/* SVG Street map simulation */}
                              <div className="mobile-map-canvas">
                                <svg viewBox="0 0 300 300" className="delivery-svg-map">
                                  {/* Background street grids grid */}
                                  <path d="M 0 50 L 300 50 M 0 150 L 300 150 M 0 250 L 300 250" stroke="#1e293b" strokeWidth="6" />
                                  <path d="M 50 0 L 50 300 M 150 0 L 150 300 M 250 0 L 250 300" stroke="#1e293b" strokeWidth="6" />
                                  
                                  {/* Delivery Route Path */}
                                  <path 
                                    d="M 50 250 L 50 150 L 250 150 L 250 50" 
                                    fill="none" 
                                    stroke={deliveryStatus === 'delayed' ? '#ef4444' : '#10b981'} 
                                    strokeWidth="4" 
                                    strokeLinecap="round" 
                                  />

                                  {/* Dispatch Base marker */}
                                  <circle cx="50" cy="250" r="6" fill="#6366f1" />
                                  
                                  {/* Delivery target destination marker */}
                                  <circle cx="250" cy="50" r="6" fill="#f59e0b" />
                                  
                                  {/* Dispatch vehicle van dot */}
                                  {deliveryStatus !== 'idle' && (
                                    <circle 
                                      cx={deliveryPathPos <= 40 
                                        ? 50 
                                        : deliveryPathPos <= 80 
                                          ? 50 + ((deliveryPathPos - 40) * 5) 
                                          : 250
                                      }
                                      cy={deliveryPathPos <= 40 
                                        ? 250 - (deliveryPathPos * 2.5) 
                                        : deliveryPathPos <= 80 
                                          ? 150 
                                          : 150 - ((deliveryPathPos - 80) * 5)
                                      } 
                                      r="7" 
                                      fill="#3b82f6" 
                                      stroke="#fff" 
                                      strokeWidth="2" 
                                      className="truck-dot"
                                    />
                                  )}
                                </svg>
                              </div>

                              {/* Navigation metadata */}
                              <div className="mobile-delivery-status-card">
                                <div className="flex-between">
                                  <span className="lbl flex-center gap-1"><MapPin size={12} /> BTM Layout Hub</span>
                                  <span className="eta font-semibold text-emerald-400 flex-center gap-1"><Clock size={12} /> {deliveryEta} mins</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">Route to: Accenture Corporate Office</div>
                              </div>

                            </div>
                          </div>
                        </div>

                        {/* Dispatch console simulator actions */}
                        <div className="bank-card dispatch-controls-card">
                          <h3>Logistics Dispatch Operation Center</h3>
                          <p className="subtext">Audits web sockets, active geofencing trackers, and updates smartphone views on vehicle progression.</p>
                          
                          <div className="status-progress-log mt-3 border border-slate-800 p-3 rounded-lg bg-slate-950 font-mono text-xs">
                            <div>[SOCKET] Geofencing status: OK</div>
                            <div>[INFO] Driver: Rahul Verma (Placed at Capgemini)</div>
                            <div>[SYS] Dispatch status: <span className={`dispatch-${deliveryStatus}`}>{deliveryStatus.toUpperCase()}</span></div>
                          </div>

                          <div className="flex flex-col gap-3 mt-4">
                            <button 
                              onClick={handleStartDelivery} 
                              disabled={deliveryStatus === 'driving' || deliveryStatus === 'delivered'}
                              className="btn btn-primary flex-center gap-1"
                            >
                              <Play size={14} /> {deliveryStatus === 'driving' ? 'In Transit...' : deliveryStatus === 'delivered' ? 'Package Delivered' : 'Launch Delivery Vehicle'}
                            </button>

                            <button 
                              onClick={handleSimulateDelay} 
                              disabled={deliveryStatus !== 'driving'}
                              className="btn btn-outline-light flex-center gap-1"
                            >
                              <AlertTriangle size={14} /> Simulate Bangalore Traffic Delay
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {!isPredefinedProject(project.id) && (
                    <div className="dynamic-sandbox-dashboard animate-fade-in">
                      {/* Dashboard Grid Header */}
                      <div className="dynamic-dashboard-header flex-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold flex-center gap-2">
                            <Layers className="text-indigo-400" size={22} />
                            {project.title} Sandbox Environment
                          </h2>
                          <p className="subtext text-sm">
                            Powered by Teknow Micro-Container. Interactive REST API and Relational Database simulation.
                          </p>
                        </div>
                        <div className="flex-center gap-2">
                          <span className="status-badge live">
                            <span className="live-dot"></span> Sandbox Online
                          </span>
                        </div>
                      </div>

                      {/* Main Dynamic Layout Grid */}
                      <div className="dynamic-grid">
                        
                        {/* LEFT COLUMN: API tester Client */}
                        <div className="bank-card api-tester-card">
                          <div className="card-header-bar">
                            <h3 className="flex-center gap-2">
                              <Globe size={18} className="text-indigo-400" />
                              Interactive API Gateway Client
                            </h3>
                            <span className="tag-api">REST CLIENT</span>
                          </div>
                          
                          <p className="subtext mb-3">
                            Test backend routing rules in real-time. Sends requests to the student's mock server.
                          </p>
                          
                          <div className="api-url-bar mb-3">
                            <select 
                              value={dynamicMethod} 
                              onChange={(e) => setDynamicMethod(e.target.value as any)}
                              className="api-method-select"
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                              <option value="PUT">PUT</option>
                              <option value="DELETE">DELETE</option>
                            </select>
                            <input 
                              type="text" 
                              value={dynamicPath} 
                              onChange={(e) => setDynamicPath(e.target.value)}
                              className="api-path-input"
                              placeholder="/api/v1/resource"
                            />
                            <button 
                              onClick={handleSendDynamicRequest} 
                              disabled={dynamicLoading}
                              className="api-send-btn flex-center"
                            >
                              {dynamicLoading ? (
                                <RefreshCw className="animate-spin" size={14} />
                              ) : (
                                <Send size={14} />
                              )}
                            </button>
                          </div>

                          {dynamicMethod !== 'GET' && (
                            <div className="api-body-section mb-3">
                              <div className="flex-between mb-1">
                                <label className="lbl">Request Payload Body (JSON)</label>
                                <span className="text-xs text-slate-500">Must include "key" and "value" to write to Database</span>
                              </div>
                              <textarea
                                value={dynamicBody}
                                onChange={(e) => setDynamicBody(e.target.value)}
                                className="api-body-textarea font-mono"
                                rows={4}
                              ></textarea>
                            </div>
                          )}

                          <div className="api-response-section">
                            <label className="lbl mb-1 block">Server Response Headers & Payload</label>
                            <div className="api-response-box font-mono">
                              {dynamicResponse ? (
                                <pre>{JSON.stringify(dynamicResponse, null, 2)}</pre>
                              ) : (
                                <span className="placeholder-text text-slate-500">Click send to dispatch request payload to mock service...</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Database Explorer & Gauges */}
                        <div className="flex flex-col gap-4">
                          
                          {/* Live Performance DevOps Indicators */}
                          <div className="bank-card devops-gauges-card">
                            <h3 className="flex-center gap-2 mb-3">
                              <Activity size={18} className="text-emerald-400" />
                              DevOps Node Cluster Gauges
                            </h3>
                            <div className="gauges-grid">
                              <div className="gauge-item">
                                <div className="gauge-outer">
                                  <svg className="gauge-svg" viewBox="0 0 36 36">
                                    <path className="gauge-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="gauge-fill performance" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  </svg>
                                  <span className="gauge-val font-semibold text-xs">92%</span>
                                </div>
                                <span className="gauge-lbl text-xs mt-1 text-slate-400">CPU Load</span>
                              </div>

                              <div className="gauge-item">
                                <div className="gauge-outer">
                                  <svg className="gauge-svg" viewBox="0 0 36 36">
                                    <path className="gauge-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="gauge-fill memory" strokeDasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  </svg>
                                  <span className="gauge-val font-semibold text-xs">45%</span>
                                </div>
                                <span className="gauge-lbl text-xs mt-1 text-slate-400">Memory Pool</span>
                              </div>

                              <div className="gauge-item">
                                <div className="gauge-outer">
                                  <svg className="gauge-svg" viewBox="0 0 36 36">
                                    <path className="gauge-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="gauge-fill database-io" strokeDasharray="88, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  </svg>
                                  <span className="gauge-val font-semibold text-xs">88%</span>
                                </div>
                                <span className="gauge-lbl text-xs mt-1 text-slate-400">DB Cache Hit</span>
                              </div>
                            </div>
                          </div>

                          {/* Database relational explorer */}
                          <div className="bank-card db-explorer-card">
                            <div className="card-header-bar">
                              <h3 className="flex-center gap-2">
                                <Database size={18} className="text-amber-400" />
                                Dynamic Database Explorer
                              </h3>
                              <span className="tag-db">SQLITE3 / POSTGRES</span>
                            </div>
                            <p className="subtext mb-3">
                              Inspect database rows in the persistent storage layer. You can manually commit transaction records here.
                            </p>
                            
                            <div className="db-table-wrapper">
                              <table className="db-table">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Key Element</th>
                                    <th>Stored Value</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dynamicDbRows.map(row => (
                                    <tr key={row.id}>
                                      <td className="font-mono text-xs text-slate-400">{row.id}</td>
                                      <td className="font-semibold text-xs text-slate-300">{row.key}</td>
                                      <td className="font-mono text-xs text-indigo-300">{row.value}</td>
                                      <td>
                                        <span className={`status-pill ${row.status.toLowerCase()}`}>
                                          {row.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <form onSubmit={handleAddDbRow} className="db-insert-form mt-3">
                              <div className="form-row-grid">
                                <input 
                                  type="text" 
                                  placeholder="Key name..." 
                                  value={dynamicNewKey}
                                  onChange={(e) => setDynamicNewKey(e.target.value)}
                                  className="form-input text-xs"
                                  required
                                />
                                <input 
                                  type="text" 
                                  placeholder="Value..." 
                                  value={dynamicNewVal}
                                  onChange={(e) => setDynamicNewVal(e.target.value)}
                                  className="form-input text-xs"
                                  required
                                />
                                <select
                                  value={dynamicNewStatus}
                                  onChange={(e) => setDynamicNewStatus(e.target.value)}
                                  className="form-select text-xs"
                                >
                                  <option value="ACTIVE">ACTIVE</option>
                                  <option value="OPTIMAL">OPTIMAL</option>
                                  <option value="SECURE">SECURE</option>
                                </select>
                                <button type="submit" className="btn btn-outline-light btn-sm flex-center">
                                  + Insert
                                </button>
                              </div>
                            </form>
                          </div>

                        </div>

                      </div>

                      {/* Dynamic terminal stdout window */}
                      <div className="bank-card stdout-terminal-card mt-4">
                        <div className="card-header-bar">
                          <h3 className="flex-center gap-2">
                            <Terminal size={18} className="text-slate-400" />
                            Microservice Stdout Monitor Console
                          </h3>
                          <span className="live-dot-terminal animate-pulse"></span>
                        </div>
                        <div className="terminal-monitor font-mono mt-3">
                          {dynamicTerminalLogs.map((log, idx) => (
                            <div key={idx} className="terminal-line text-slate-300">
                              <span className="terminal-prompt text-emerald-400">$</span> {log}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Collapsible Developer Network Inspector Console */}
            <div className={`network-inspector ${inspectorExpanded ? 'expanded' : 'collapsed'}`}>
              <div className="inspector-header" onClick={() => setInspectorExpanded(!inspectorExpanded)}>
                <span className="flex-center gap-1">
                  <Terminal size={14} /> Developer Network Inspector
                  <span className="logs-count-badge">{inspectorLogs.length} requests</span>
                </span>
                <button className="inspector-toggle-btn">
                  {inspectorExpanded ? '▼ Minimize' : '▲ Open Console'}
                </button>
              </div>
              {inspectorExpanded && (
                <div className="inspector-body">
                  <table className="inspector-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Status</th>
                        <th>Request Payload</th>
                        <th>Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...inspectorLogs].reverse().map((log, idx) => (
                        <tr key={idx}>
                          <td className="time-col">{log.timestamp}</td>
                          <td>
                            <span className={`method-badge ${log.method.toLowerCase()}`}>{log.method}</span>
                          </td>
                          <td className="url-col">{log.url}</td>
                          <td>
                            <span className={`status-badge status-${log.status >= 200 && log.status < 300 ? 'ok' : 'err'}`}>
                              <span className="status-dot"></span>
                              {log.status} {log.statusText}
                            </span>
                          </td>
                          <td className="json-col hoverable-json">
                            {log.payload ? (
                              <>
                                <span className="json-summary">{'{...}'}</span>
                                <pre className="json-tooltip">{JSON.stringify(log.payload, null, 2)}</pre>
                              </>
                            ) : <span className="text-slate-600">-</span>}
                          </td>
                          <td className="json-col hoverable-json">
                            {log.response ? (
                              <>
                                <span className="json-summary">{'{...}'}</span>
                                <pre className="json-tooltip">{JSON.stringify(log.response, null, 2)}</pre>
                              </>
                            ) : <span className="text-slate-600">-</span>}
                          </td>
                        </tr>
                      ))}
                      {inspectorLogs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center text-slate-500 py-3">No network activity logged yet. Trigger actions in the simulation preview.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* BOTTOM METRIC CARD ROW ABOUT DESIGN OUTCOME */}
        <div className="container sandbox-metrics-footer mt-4">
          <div className="bank-card footer-metrics-card flex-between">
            <div>
              <span className="tag">💡 CASE STUDY OUTCOME</span>
              <h4>{project.title}</h4>
              <p>{project.challengesSolved}</p>
            </div>
            <div className="tech-badge-strip">
              {project.techStack.map((tech, idx) => (
                <span className="badge-tech" key={idx}>{tech}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default LiveSandbox;
