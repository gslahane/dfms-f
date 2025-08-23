// src/components/mlc/MlcDashboard.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const rows = [
  { id: 801, workCode: "MLC/2425/1101", name: "Primary Health Centre Upgradation", ia: "ZP Health Dept., Pune", mlcLetter: "MLC/2425/1101", recAmt: 980.0, aaAmt: 900.0, aaLetter: "AA/2024/201", disbursed: 0, status: "Not Started" },
];

const MlcDashboard: React.FC = () => {
  const totalRecommendedWorks = rows.length;
  const totalRecommendedAmount = useMemo(() => rows.reduce((s, r) => s + r.recAmt, 0), []);
  const totalSanctioned = rows.filter(r => r.aaAmt > 0).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3"><div className="text-sm font-medium">2024-25</div></div>
        <div className="col-span-12 sm:col-span-6">
          <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="Search works, IA name, or AA letter..." />
        </div>
        <div className="col-span-12 sm:col-span-3 flex justify-end">
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div className="rounded-md border bg-white p-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
          <p className="text-xs text-gray-500">Total Works Recommended</p>
          <p className="mt-1 text-2xl font-semibold">{totalRecommendedWorks}</p>
          <p className="text-[11px] text-gray-500 mt-1">Total Work Cost: ₹{totalRecommendedAmount.toFixed(1)} L</p>
        </motion.div>
        <motion.div className="rounded-md border bg-white p-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.05}}>
          <p className="text-xs text-gray-500">Total Works Sanctioned</p>
          <p className="mt-1 text-2xl font-semibold">{totalSanctioned}</p>
          <p className="text-[11px] text-gray-500 mt-1">Cost of Sanctioned: ₹9.0 L</p>
        </motion.div>
        <motion.div className="rounded-md border bg-white p-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
          <p className="text-xs text-gray-500">Permissible Scope</p>
          <p className="mt-1 text-2xl font-semibold">₹0.9 Cr</p>
          <p className="text-[11px] text-gray-500 mt-1">Demo value</p>
        </motion.div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Works</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                {["Sr No","Work Name","IA Name","MLC Letter","Recommended Amount","AA Amount","AA Letter","Fund Disbursed","Status",""].map(h=>(
                  <TableHead key={h} className="text-[11px]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r)=>(
                <TableRow key={r.id} className="align-top">
                  <TableCell className="text-xs">{r.id}</TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-[11px] text-gray-500">FY: 2024–25</div>
                  </TableCell>
                  <TableCell className="text-xs">{r.ia}</TableCell>
                  <TableCell className="text-xs">{r.mlcLetter}</TableCell>
                  <TableCell className="text-right text-xs">₹{r.recAmt.toFixed(1)}</TableCell>
                  <TableCell className="text-right text-xs">₹{r.aaAmt.toFixed(1)}</TableCell>
                  <TableCell className="text-xs">{r.aaLetter}</TableCell>
                  <TableCell className="text-right text-xs text-emerald-700">₹{r.disbursed.toFixed(1)}</TableCell>
                  <TableCell className="text-xs">{r.status}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost"><Eye className="w-4 h-4 text-blue-600"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MlcDashboard;
