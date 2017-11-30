#
# Copyright 2017 Scott J. Johnson (http://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# 
# FTDPctGainThreshold
#
# Based on Market School rules, the minimum gain necessary for a Follow-
# Through Day as determined by the average gain on up days for the last
# 200 market days
#
input Period = 200;

def Up = If(close > close[1], (close - close[1])/close*100, 0);
def Count = If(close > close[1], 1, 0);

def UpTotalGain = Sum(Up, Period);
def UpTotalDays = Sum(Count, Period);
def AvgGainPct = UpTotalGain/UpTotalDays;

def FTDMinPctGain;

if (AvgGainPct < 0.4) {
    FTDMinPctGain = 0.7;
} else if (AvgGainPct >= 0.4 and AvgGainPct < 0.55) {
    FTDMinPctGain = 0.85;
} else if (AvgGainPct >= 0.55 and AvgGainPct < 1.0) {
    FTDMinPctGain = 1.0;
} else if (AvgGainPct >= 1.0) {
    FTDMinPctGain = 1.245;
} else {
    FTDMinPctGain = FTDMinPctGain[1];
}

plot FTDMinPctGainGraph = FTDMinPctGain;
FTDMinPctGainGraph.AssignValueColor(Color.CYAN);
FTDMinPctGainGraph.SetLineWeight(3);

plot AvgGainGraph = AvgGainPct;
AvgGainGraph.AssignValueColor(Color.YELLOW);
AvgGainGraph.SetLineWeight(2);



