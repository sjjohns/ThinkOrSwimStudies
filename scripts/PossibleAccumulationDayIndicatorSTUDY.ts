#
# Copyright 2017 Scott J. Johnson (https://scottjjohnson.com)
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
# PossibleAccumulationDayIndicator
#
# Adds an indicator on the chart when the price gain is greater than the 
# minimum necessary for an Accumulation Day per Market School rules. This
# is a "possible" AD because Market School also requires volume to be greater
# than the prior day, but TOS doesn't have COMP volume so that portion of the
# rule must be applied manually.
#
#declare upper;
input Period = 200;

def Up = If(close > close[1], (close - close[1])/close*100, 0);
def Count = If(close > close[1], 1, 0);

def UpTotalGain = Sum(Up, Period);
def UpTotalDays = Sum(Count, Period);
def AvgGainPct = UpTotalGain/UpTotalDays;

def AccumulationDayMinPctGain;

if (AvgGainPct < 0.4) {
    AccumulationDayMinPctGain = 0.7;
} else if (AvgGainPct >= 0.4 and AvgGainPct < 0.55) {
    AccumulationDayMinPctGain = 0.85;
} else if (AvgGainPct >= 0.55 and AvgGainPct < 1.0) {
    AccumulationDayMinPctGain = 1.0;
} else if (AvgGainPct >= 1.0) {
    AccumulationDayMinPctGain = 1.245;
} else {
    AccumulationDayMinPctGain = Double.NAN;
}

plot AccumulationDay = (Up >= AccumulationDayMinPctGain);
AccumulationDay.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
AccumulationDay.SetDefaultColor(Color.GREEN);

