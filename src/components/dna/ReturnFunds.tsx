import React, { useState, useMemo, useEffect } from 'react';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

// Interfaces
interface SchemeInput {
  schemeCRC: string;
  schemeTitle: string;
  budgetThousands: number;
  demandCode: 'O-26 (Revenue)' | 'O-27 (Capital)';
}

interface DemandData {
  demandNumber: 'O-26' | 'O-27';
  budget: number;
  schemes: SchemeInput[];
}

interface Scheme {
  id: string;
  name: string;
  limit: number;
  utilized: number;
}


const DEMANDS: DemandData[] = [
 {
      "demandNumber": "O-26",
      "district": " PUNE",
      "budget": 12340156,
      "fundsDistributed": 0,
      "balanceBudget": 0,
      "demandsPendingForApproval": 16000,
      "schemes": [
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"20410644","schemeTitle":"District Road Safety Measures","objectCode":31,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2053A233","schemeTitle":"Strengthening of Dynamic Government Administration and Emergency Management System","objectCode":13,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2053A233","schemeTitle":"Strengthening of Dynamic Government Administration and Emergency Management System","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2053A233","schemeTitle":"Strengthening of Dynamic Government Administration and Emergency Management System","objectCode":27,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2053A233","schemeTitle":"Strengthening of Dynamic Government Administration and Emergency Management System","objectCode":31,"budgetThousands":474001},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2202J395","schemeTitle":"Assistance to Zilla Parishad for Special Repairs of School Buildings, Rooms and Latrine","objectCode":31,"budgetThousands":250000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2202J733","schemeTitle":"Creating infrastructure for primary/ secondary schools in Zilla Parishad area","objectCode":31,"budgetThousands":250000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2202K079","schemeTitle":"Assistance for Aadarsh Schools to construct basic facilities","objectCode":31,"budgetThousands":250000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2202K426","schemeTitle":"Creation of Science labs, Computer labs, Digital schools, Internet/Wi-Fi facilities","objectCode":31,"budgetThousands":250000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22031029","schemeTitle":"Development of facilities in Pre S.S.C. Vocational Education.(District Plan-Pune)","objectCode":21,"budgetThousands":599},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22031029","schemeTitle":"Development of facilities in Pre S.S.C. Vocational Education.(District Plan-Pune)","objectCode":52,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22033077","schemeTitle":"Plus two stage Vocational education","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22033077","schemeTitle":"Plus two stage Vocational education","objectCode":52,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22042538","schemeTitle":"Welfare Extension Youth Programme in Rural areas.(District Plan-Pune)","objectCode":31,"budgetThousands":2000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22042565","schemeTitle":"Development of Play Grounds.(District Plan-Pune)","objectCode":31,"budgetThousands":140000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22044684","schemeTitle":"(District Plan-Pune) Grant -in-aid to Gymnasium and Play Ground","objectCode":31,"budgetThousands":140000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22052165","schemeTitle":"Government Central,Divisional and District Libraries.(District Plan-Pune)","objectCode":13,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22052165","schemeTitle":"Government Central,Divisional and District Libraries.(District Plan-Pune)","objectCode":21,"budgetThousands":999},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22053279","schemeTitle":"Assistance to Grampanchyat and other public libraries","objectCode":31,"budgetThousands":100},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22053813","schemeTitle":"Conservation of forts, temples and important Protected monuments etc. in the state","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22053813","schemeTitle":"Conservation of forts, temples and important Protected monuments etc. in the state","objectCode":27,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22053813","schemeTitle":"Conservation of forts, temples and important Protected monuments etc. in the state","objectCode":31,"budgetThousands":313678},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210H614","schemeTitle":"Purchase of Medicines, Machinery and Equipments for Primary Health Centres/ Sub-centres","objectCode":31,"budgetThousands":80000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210H955","schemeTitle":"Construction, Extension, Repairs, Maintenance, Purchase of Fire safety equipments & Repairs, Structural Audit of primary health centres/ sub-centres, Construction of Burial Pit","objectCode":31,"budgetThousands":656980},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210I292","schemeTitle":"Purchase, Repairs and Maintenance of Ambulances to Primary Health Centers as per norm (Sanctioned Quantity)","objectCode":31,"budgetThousands":5000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210I639","schemeTitle":"Strengthening of Primary Health Centers/ Sub Centres/ Ayurvedic and Unani Dispensaries (Increase in Facilities)","objectCode":31,"budgetThousands":25000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210I971","schemeTitle":"Construction of Zilla Parishad Dispensaries/ Primary Health units","objectCode":31,"budgetThousands":5500},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210J332","schemeTitle":"Purchase of Medicines, Machinery, and Equipments for Hospitals","objectCode":13,"budgetThousands":20000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210J332","schemeTitle":"Purchase of Medicines, Machinery, and Equipments for Hospitals","objectCode":21,"budgetThousands":200000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210J332","schemeTitle":"Purchase of Medicines, Machinery, and Equipments for Hospitals","objectCode":31,"budgetThousands":100000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210J682","schemeTitle":"Special programs for upgradation of hospital services and equipment (purchase and maintanenceof ambulances)","objectCode":13,"budgetThousands":100},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210J682","schemeTitle":"Special programs for upgradation of hospital services and equipment (purchase and maintanenceof ambulances)","objectCode":21,"budgetThousands":100},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210J682","schemeTitle":"Special programs for upgradation of hospital services and equipment (purchase and maintanenceof ambulances)","objectCode":31,"budgetThousands":100},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2210J682","schemeTitle":"Special programs for upgradation of hospital services and equipment (purchase and maintanenceof ambulances)","objectCode":51,"budgetThousands":1700},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22159612","schemeTitle":"Installation of power-pumps, conversion of hand-pumps into power-pumps and their maintenance and repairs","objectCode":31,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22171751","schemeTitle":"Grant-in-aid to municipal council for implementation of Development Plans.(District Plan-Pune)","objectCode":31,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22178442","schemeTitle":"(37)(08)Maharashtra Nagarutthan Abhiyan(2217****)31 Grants in aid","objectCode":31,"budgetThousands":2287500},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2217A323","schemeTitle":"Strengthening of Fire fighting and emergency Services","objectCode":31,"budgetThousands":159098},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2217A352","schemeTitle":"Improvement of other Bastis/Slums in urban areas","objectCode":31,"budgetThousands":887400},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22200885","schemeTitle":"Strenthning of District Information Office(2220****)13 Office Expences21 Supplies and Material50 Other Expenditure","objectCode":21,"budgetThousands":1501},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22255479","schemeTitle":"State Government Post Matrics Scholarships.(District Plan-Pune)","objectCode":34,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22255586","schemeTitle":"Grant in aid to Zilla Parishad under section 187 of Maharashtra Zilla Parishad and Panchayat Samitis","objectCode":31,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2225F853","schemeTitle":"Tanda/Basti Improvement Scheme","objectCode":31,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22302319","schemeTitle":"Procurement of Deficient Equipment in existing I.T.Is(District Plan-Pune)","objectCode":21,"budgetThousands":23699},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22302319","schemeTitle":"Procurement of Deficient Equipment in existing I.T.Is(District Plan-Pune)","objectCode":52,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2230A488","schemeTitle":"Minimum Skill Development Programme","objectCode":20,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2230A488","schemeTitle":"Minimum Skill Development Programme","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2230A488","schemeTitle":"Minimum Skill Development Programme","objectCode":31,"budgetThousands":30000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22354315","schemeTitle":"Grants to Mahila Mandals.(District Plan-Pune)","objectCode":31,"budgetThousands":2000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2235C671","schemeTitle":"Empowerment of Women and Child Development","objectCode":13,"budgetThousands":100},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2235C671","schemeTitle":"Empowerment of Women and Child Development","objectCode":27,"budgetThousands":100},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2235C671","schemeTitle":"Empowerment of Women and Child Development","objectCode":31,"budgetThousands":1000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22362315","schemeTitle":"Integrated Child Development Services","objectCode":13,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22362315","schemeTitle":"Integrated Child Development Services","objectCode":27,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"22362315","schemeTitle":"Integrated Child Development Services","objectCode":31,"budgetThousands":260476},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24034146","schemeTitle":"Construction of Veterinary Dispensaries, Primary aid Centers (District)(District Plan-Pune)","objectCode":13,"budgetThousands":700},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24034146","schemeTitle":"Construction of Veterinary Dispensaries, Primary aid Centers (District)(District Plan-Pune)","objectCode":21,"budgetThousands":10000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24034146","schemeTitle":"Construction of Veterinary Dispensaries, Primary aid Centers (District)(District Plan-Pune)","objectCode":31,"budgetThousands":30000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24034155","schemeTitle":"Supply of Medicines to the Veterinary Institutions(District Plan-Pune)","objectCode":31,"budgetThousands":28800},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24034235","schemeTitle":"Subsidy for supply of poultry units under Self Employment Creation Programme","objectCode":31,"budgetThousands":4999},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24034235","schemeTitle":"Subsidy for supply of poultry units under Self Employment Creation Programme","objectCode":33,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24034244","schemeTitle":"Fodder and Feed Development -Grants to Zilla Parishads(State Plan)(District Plan-Pune)","objectCode":31,"budgetThousands":50000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24034271","schemeTitle":"Plan Grants to Zilla Parishads.(State Plan)(District Plan-Pune)","objectCode":31,"budgetThousands":800},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2403C027","schemeTitle":"Kamdhenu Dattak Gram Yojana","objectCode":31,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24043554","schemeTitle":"Integrated Dairy Development Project.(State Plan)(District Plan-Pune)","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24051895","schemeTitle":"Fish Seed Farms - State Plan Scheme.(District Plan-Pune)","objectCode":21,"budgetThousands":1100},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24057946","schemeTitle":"Fisheries Requisite","objectCode":31,"budgetThousands":880},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24057946","schemeTitle":"Fisheries Requisite","objectCode":33,"budgetThousands":20},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24062938","schemeTitle":"Reafforestation of degraded Forest.(District Plan-Pune)","objectCode":2,"budgetThousands":52000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24062938","schemeTitle":"Reafforestation of degraded Forest.(District Plan-Pune)","objectCode":21,"budgetThousands":13000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24065795","schemeTitle":"(District Plan-Pune)Village Eco-development and Tribal Development-","objectCode":2,"budgetThousands":24000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24065795","schemeTitle":"(District Plan-Pune)Village Eco-development and Tribal Development-","objectCode":21,"budgetThousands":6000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24067412","schemeTitle":"(02)(37)Joint forest Management(2406****)02 Wages,21 Supplies and Material","objectCode":2,"budgetThousands":16000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24067412","schemeTitle":"(02)(37)Joint forest Management(2406****)02 Wages,21 Supplies and Material","objectCode":21,"budgetThousands":4000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24068079","schemeTitle":"Central Nurseries","objectCode":2,"budgetThousands":60000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24068079","schemeTitle":"Central Nurseries","objectCode":21,"budgetThousands":15000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2406B397","schemeTitle":"Eco Tourism","objectCode":2,"budgetThousands":40000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2406B397","schemeTitle":"Eco Tourism","objectCode":21,"budgetThousands":24000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"2406B397","schemeTitle":"Eco Tourism","objectCode":27,"budgetThousands":16000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"24251671","schemeTitle":"Dr. Panjabrao Deshmukh Interest Rebate Scheme.(District Plan-Pune)","objectCode":33,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"25151499","schemeTitle":"Special Grants to big village panchayat for providing civic facility","objectCode":31,"budgetThousands":750000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"25151505","schemeTitle":"Special Grants to village panchayat for providing civic facility","objectCode":31,"budgetThousands":1000000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"25152717","schemeTitle":"Grants to Zilla Parishad for purchase of launch to start passenger traffic on river","objectCode":31,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"27025287","schemeTitle":"Minor Irrigation Works- General Plan (Adjusted with Ways and Means Advances)","objectCode":31,"budgetThousands":159900},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"27025296","schemeTitle":"General Plan (Kolhapur Type Weirs)(Adjusted with Ways and Means Advanes)(District Plan-Pune)","objectCode":31,"budgetThousands":62782},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"27029783","schemeTitle":"Survey Works under Irrigation Scheme (0 to 100 ha.)","objectCode":31,"budgetThousands":10000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"28015839","schemeTitle":"Assistance to MSEDCL Co. Ltd for General Development and System Improvement","objectCode":31,"budgetThousands":750000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"28101101","schemeTitle":"Non-Conventional Energy Development","objectCode":31,"budgetThousands":150000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"28511821","schemeTitle":"Schemes for Providing stipends to entrepreneurs for starting enterprise under the Educated Un-employed Scheme","objectCode":34,"budgetThousands":2000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"28516752","schemeTitle":"Grants for Silk Yarn Production","objectCode":31,"budgetThousands":4000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"30543317","schemeTitle":"Grants to Zilla Parishad for Strengthening and Development of Other District Roads","objectCode":31,"budgetThousands":500000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"30543611","schemeTitle":"Grants to Zilla Parishad for Strengthening and development of Village Roads","objectCode":31,"budgetThousands":1000000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34511795","schemeTitle":"Innovative Schemes (3451 ****)","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34511795","schemeTitle":"Innovative Schemes (3451 ****)","objectCode":27,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34511795","schemeTitle":"Innovative Schemes (3451 ****)","objectCode":31,"budgetThousands":470518},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34511991","schemeTitle":"Evaluation, Monitaring and Data Entry of Schemes (3451 ****)","objectCode":13,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34511991","schemeTitle":"Evaluation, Monitaring and Data Entry of Schemes (3451 ****)","objectCode":20,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34511991","schemeTitle":"Evaluation, Monitaring and Data Entry of Schemes (3451 ****)","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34511991","schemeTitle":"Evaluation, Monitaring and Data Entry of Schemes (3451 ****)","objectCode":28,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34511991","schemeTitle":"Evaluation, Monitaring and Data Entry of Schemes (3451 ****)","objectCode":31,"budgetThousands":52276},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34512497","schemeTitle":"(37)(04)Other District Schemes (3451 ****)","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34512497","schemeTitle":"(37)(04)Other District Schemes (3451 ****)","objectCode":27,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34512497","schemeTitle":"(37)(04)Other District Schemes (3451 ****)","objectCode":31,"budgetThousands":12606},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34512998","schemeTitle":"Strengthening of District Planning Committee","objectCode":13,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34512998","schemeTitle":"Strengthening of District Planning Committee","objectCode":20,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34512998","schemeTitle":"Strengthening of District Planning Committee","objectCode":21,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34512998","schemeTitle":"Strengthening of District Planning Committee","objectCode":28,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34512998","schemeTitle":"Strengthening of District Planning Committee","objectCode":31,"budgetThousands":7},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"34522132","schemeTitle":"Places which have been categorised as","objectCode":31,"budgetThousands":100000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-26 (Revenue)","schemeCRC":"36040621","schemeTitle":"Special Programme for Development of Pilgrimage Places (Plan)(District Plan-Pune)","objectCode":50,"budgetThousands":100000}
      ]
    }
 ,
    {
      "demandNumber": "O-27",
      "district": "PUNE",
      "budget": 1449844,
      "fundsDistributed": 0,
      "balanceBudget": 0,
      "demandsPendingForApproval": 160000,
      "schemes": [
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"40550386","schemeTitle":"Provide infrastructural facilities to various establishments of Police and Prisons in Home Department, Implementing various technological projects including CCTV system, as also strengthening of traffic arrangements.","objectCode":50,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"40550386","schemeTitle":"Provide infrastructural facilities to various establishments of Police and Prisons in Home Department, Implementing various technological projects including CCTV system, as also strengthening of traffic arrangements.","objectCode":51,"budgetThousands":177433},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"40550386","schemeTitle":"Provide infrastructural facilities to various establishments of Police and Prisons in Home Department, Implementing various technological projects including CCTV system, as also strengthening of traffic arrangements.","objectCode":52,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"40550386","schemeTitle":"Provide infrastructural facilities to various establishments of Police and Prisons in Home Department, Implementing various technological projects including CCTV system, as also strengthening of traffic arrangements.","objectCode":53,"budgetThousands":136245},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"40591436","schemeTitle":"Major Works","objectCode":53,"budgetThousands":150000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"40592601","schemeTitle":"Construction of Protection Wall to Prevent Encrochment on Public Lands","objectCode":53,"budgetThousands":50000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"42103336","schemeTitle":"Construction/ Extension, Repairs Maintenance, of hospitals, Purchase & Repairs of Fire safety equipments, Structural Audit & Electrical Audit of Hospital","objectCode":53,"budgetThousands":20000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"42160736","schemeTitle":"Major Works.(District Plan-Pune)General Pool Accoommodation","objectCode":53,"budgetThousands":50000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"42350449","schemeTitle":"Major Works of Women and Child Developmemt Department","objectCode":51,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"42350449","schemeTitle":"Major Works of Women and Child Developmemt Department","objectCode":52,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"42350449","schemeTitle":"Major Works of Women and Child Developmemt Department","objectCode":53,"budgetThousands":50000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"42501783","schemeTitle":"Land acquisition and construction of Workshop building for I.T.Is(4250****)53 Major works","objectCode":53,"budgetThousands":50000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"42501809","schemeTitle":"Construction of Government Technical school(4250****) 21 Supplies and Material, 53 Major works","objectCode":53,"budgetThousands":14000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"42502224","schemeTitle":"Construction of hostel for ITI students & providing training facilities(","objectCode":53,"budgetThousands":6500},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44021765","schemeTitle":"Land Development through Soil Conservation Measures","objectCode":53,"budgetThousands":5000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44031641","schemeTitle":"Constuction,Strenthning and Modernization of Veterinary hospital and Despensaries(4403****)53 Major works","objectCode":52,"budgetThousands":4000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44031641","schemeTitle":"Constuction,Strenthning and Modernization of Veterinary hospital and Despensaries(4403****)53 Major works","objectCode":53,"budgetThousands":20000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44051021","schemeTitle":"Fish Seed Farm","objectCode":53,"budgetThousands":20000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44061122","schemeTitle":"Schemes in the Five Year Plan- State Plan Scheme-Forest Roads and Bridges.(District Plan-Pune)","objectCode":2,"budgetThousands":36000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44061122","schemeTitle":"Schemes in the Five Year Plan- State Plan Scheme-Forest Roads and Bridges.(District Plan-Pune)","objectCode":21,"budgetThousands":9000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44063188","schemeTitle":"Soil and water conservation works in the Forest","objectCode":2,"budgetThousands":104000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44063188","schemeTitle":"Soil and water conservation works in the Forest","objectCode":21,"budgetThousands":26000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"44063902","schemeTitle":"Buildings In Forest","objectCode":53,"budgetThousands":35000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"45150997","schemeTitle":"Other District Scheme","objectCode":52,"budgetThousands":114560},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"45150997","schemeTitle":"Other District Scheme","objectCode":53,"budgetThousands":10000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"4702A251","schemeTitle":"Land Acquisition for Minor Irrigation","objectCode":53,"budgetThousands":99},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"4702A494","schemeTitle":"Construction and Repairs of Minor Irrigation Works (Upto 101 to 250 ha. Capacity)","objectCode":53,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"47112892","schemeTitle":"Works for Flood-Control","objectCode":53,"budgetThousands":10000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"50545494","schemeTitle":"Construction of Sakav","objectCode":53,"budgetThousands":350000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"62170204","schemeTitle":"Loans to Municipal Councils for implementation of Development Plans.(District Plan-Pune)","objectCode":55,"budgetThousands":1},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"62500323","schemeTitle":"Loans to Educated unemployed by way of Seed Money.(District Plan-Pune)","objectCode":55,"budgetThousands":2000},
        {"district":"Pune","planType":"General Plan","fy":"2025-26","demandCode":"O-27 (Capital)","schemeCRC":"68510537","schemeTitle":"Loans for Rural Industrial Project Programme in the District Industries Centres(District Plan-Pune)","objectCode":55,"budgetThousands":1}
      ]
    }];

export default function ReturnFunds() {
  const demandOptions = useMemo(() => [
    { value: 'O-26', label: 'O-26 (Revenue)' },
    { value: 'O-27', label: 'O-27 (Capital)' }
  ], []);

  const [selectedDemand, setSelectedDemand] = useState<'O-26' | 'O-27'>('O-26');
  const [fromIds, setFromIds] = useState<string[]>([]);
  const [toId, setToId] = useState<string>('');
  const [debitAmount, setDebitAmount] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const baseSchemes = useMemo<Scheme[]>(() => {
    const demand = DEMANDS.find(d => d.demandNumber === selectedDemand);
    if (!demand) return [];
    return demand.schemes.map((s, i) => ({
      id: `${s.schemeCRC}-${i}`,
      name: `${s.schemeCRC} – ${s.schemeTitle}`,
      limit: s.budgetThousands * 1000,
      utilized: 0
    }));
  }, [selectedDemand]);

  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    setSchemes(baseSchemes);
    if (baseSchemes.length >= 2) {
      setFromIds([baseSchemes[0].id]);
      setToId(baseSchemes[1].id);
    } else {
      setFromIds([]);
      setToId('');
    }
    setDebitAmount('');
    setCreditAmount('');
    setMessage(null);
  }, [baseSchemes]);

  const fromSchemes = schemes.filter(s => fromIds.includes(s.id));
  const to = schemes.find(s => s.id === toId) || null;

  const totalFromBalance = fromSchemes.reduce((sum, s) => sum + (s.limit - s.utilized), 0);
  const toBalance = to ? to.limit - to.utilized : 0;
  const debit = Number(debitAmount) || 0;
  const credit = Number(creditAmount) || 0;
  const previewToUtilized = to ? to.utilized + credit : 0;

  const handleTransfer = () => {
    setMessage(null);

    if (debit <= 0 || credit <= 0) {
      return setMessage({ text: 'Enter both debit and credit amounts.', type: 'error' });
    }

    if (debit !== credit) {
      return setMessage({ text: 'Debited and Credited amounts must be equal.', type: 'error' });
    }

    if (debit > totalFromBalance) {
      return setMessage({ text: 'Debited amount exceeds total selected scheme balance.', type: 'error' });
    }

    if (credit > toBalance) {
      return setMessage({ text: 'Credited amount exceeds target scheme balance.', type: 'error' });
    }

    let remaining = debit;
    const updatedSchemes = schemes.map(s => {
      if (fromIds.includes(s.id) && remaining > 0) {
        const available = s.limit - s.utilized;
        const use = Math.min(available, remaining);
        remaining -= use;
        return { ...s, utilized: s.utilized + use };
      }
      if (s.id === toId && to) {
        return { ...s, utilized: s.utilized - credit };
      }
      return s;
    });

    setSchemes(updatedSchemes);
    setDebitAmount('');
    setCreditAmount('');
    setFromIds([]);
    setMessage({ text: 'Transfer successful!', type: 'success' });
  };

  return (
    <Card className="shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <CardTitle className="text-2xl font-bold">Re-Appropriation</CardTitle>
        </div>
        <div className="w-48">
          <Select value={selectedDemand} onValueChange={v => setSelectedDemand(v as 'O-26' | 'O-27')}>
            <SelectTrigger>
              <SelectValue placeholder="Choose demand" />
            </SelectTrigger>
            <SelectContent>
              {demandOptions.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Debit and Credit Amounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Debited Amount (₹)</label>
            <Input
              type="number"
              value={debitAmount}
              onChange={e => setDebitAmount(e.target.value)}
              placeholder={`Max ₹${totalFromBalance.toLocaleString()}`}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Credited Amount (₹)</label>
            <Input
              type="number"
              value={creditAmount}
              onChange={e => setCreditAmount(e.target.value)}
              placeholder={`Max ₹${toBalance.toLocaleString()}`}
            />
          </div>
        </div>

        {(debit !== credit && (debit > 0 || credit > 0)) && (
          <div className="text-red-600 italic text-sm mt-2">
            *Credited Amount Should be equal to Debited Amount
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Debited From */}
          <section className="flex-1 bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Debited From (Multiple)</h3>
            <Select
              value=""
              onValueChange={v => {
                if (!fromIds.includes(v)) setFromIds([...fromIds, v]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source schemes" />
              </SelectTrigger>
              <SelectContent>
                {schemes.filter(s => s.id !== toId).map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ul className="mt-4 text-sm space-y-1">
              {fromSchemes.map(s => (
                <li key={s.id} className="flex justify-between">
                  <span>{s.name}</span>
                  <button
                    className="text-red-600 text-xs"
                    onClick={() => setFromIds(fromIds.filter(id => id !== s.id))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <ul className="mt-4 text-sm space-y-1">
              <li><strong>Total Available:</strong> ₹{totalFromBalance.toLocaleString()}</li>
            </ul>
          </section>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRightLeft className="w-12 h-12 text-blue-500" />
          </div>

          {/* Credited To */}
          <section className="flex-1 bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Credited To</h3>
            <Select value={toId} onValueChange={setToId}>
              <SelectTrigger>
                <SelectValue placeholder="Select target scheme" />
              </SelectTrigger>
              <SelectContent>
                {schemes.filter(s => !fromIds.includes(s.id)).map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ul className="mt-4 text-sm space-y-1">
              <li>Limit: ₹{to ? to.limit.toLocaleString() : '-'}</li>
              <li>Utilized: ₹{to ? to.utilized.toLocaleString() : '-'}</li>
              <li>Balance: ₹{toBalance.toLocaleString()}</li>
            </ul>
          </section>
        </div>

        {/* Preview */}
        {to && credit > 0 && (
          <div className="text-sm space-y-1">
            <div>
              <strong>Post-Transfer “To” Utilized:</strong>{' '}
              <span className={previewToUtilized > to.limit ? 'text-red-600' : 'text-green-600'}>
                ₹{previewToUtilized.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Transfer Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleTransfer}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={
              !to ||
              debit <= 0 ||
              credit <= 0 ||
              debit !== credit ||
              debit > totalFromBalance ||
              credit > toBalance
            }
          >
            Submit For Approval
          </Button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-3 mt-4 rounded ${
              message.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
