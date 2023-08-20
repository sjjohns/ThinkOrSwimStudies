#
# Copyright 2021 Scott J. Johnson (https://scottjjohnson.com)
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
# RelativeStrengthWithNewHighIndicators
#
# Compares the price trend of the current symbol to another symbol.
#
# Pink circles indicate symbol's relative strength was making a new high before 
# making a new high in price. A blue circle over the last bar indicates relative
# strength is currently at a new high (regardless of price).
#
declare lower;

input comparisonSymbol = "SPX";
input barsToLookBackForHigh = 100;

#
# Relative Strength Plot
#

def comparisonClose = close(comparisonSymbol);
def rs = if comparisonClose == 0 then 0 else close/comparisonClose;

plot rsPlot = rs;
rsPlot.setPaintingStrategy(PaintingStrategy.LINE);
rsPlot.AssignValueColor(if rs > rs[1] then Color.Uptick else Color.DownTick);
rsPlot.setLineWeight(2);
rsPlot.HideBubble();
rsPlot.HideTitle();

#
# RS New High Before Price Plot
#

def lastBar = !IsNaN(close) && IsNaN(close[-1]);
def highestRS = Highest(rs, barsToLookBackForHigh);
def todayIsNewHighRS = if rs >= highestRS then rs else -1;

def highestClosePrice = Highest(close, barsToLookBackForHigh);
def todayIsNewHighClosePrice = if close >= highestClosePrice then rs else -1;

def rsNewHighBeforePrice = !lastBar && todayIsNewHighRS > 0 && todayIsNewHighClosePrice == -1;

plot rsNewHighBeforePricePlot = if (rsNewHighBeforePrice, rs * 1, Double.NAN);
rsNewHighBeforePricePlot.setPaintingStrategy(PaintingStrategy.Points);
rsNewHighBeforePricePlot.setDefaultColor(Color.Dark_Orange);
rsNewHighBeforePricePlot.setLineWeight(5);
rsNewHighBeforePricePlot.HideBubble();
rsNewHighBeforePricePlot.HideTitle();

#
# Current RS at New High Plot
#

def showBlueIndicator = if (lastBar && todayIsNewHighRS > 0, rs * 1.0001, Double.NAN);

plot currentRSAtNewHigh = showBlueIndicator;
currentRSAtNewHigh.setPaintingStrategy(PaintingStrategy.Points);
currentRSAtNewHigh.setDefaultColor(CreateColor(111,189,232)); # medium blue
currentRSAtNewHigh.setLineWeight(5);
currentRSAtNewHigh.HideBubble();
currentRSAtNewHigh.HideTitle();



