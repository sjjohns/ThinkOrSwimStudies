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
# AccumulationDistributionBarCountBreakout
#
# Counts the instances of accumulation and distribution in a stock over a 
# period of time.  Based on Mike Scott's presentation at the IBD National Meetup
# in May 2014.
# http://ibdtv.investors.com/national-meetup-events/699580-.aspx
#
# I've tweaked the logic and parameters based on additional research.
#
# This study differs from AccumulationDistributionBarCount in that this one displays
# separate counts for accumulation days, distribution days, and net accumulation/
# distribution (positive count - negative count). 
#
# This study is designed to be applied with the aggregation period of days or weeks.
#
declare lower;

input AvgVolumePeriod = 50;

# 50 day average volume
def AvgVolume = Average(volume, AvgVolumePeriod);

# accumulation/distribution count
def BarCountDataPos;
def BarCountDataNeg;
def PriceChange;
def PriceHigh;
def PriceLow;
def PriceRange;
def CloseRelativeToPriceRange;

if (volume > AvgVolume) {
    PriceChange = close - close[1];
    PriceHigh = max(high, close[1]);
    PriceLow = min(low, close[1]);
    PriceRange = PriceHigh - PriceLow;
    CloseRelativeToPriceRange = (close - PriceLow) / PriceRange;

    if (PriceChange > 0) {  # positive close
        if (CloseRelativeToPriceRange >= 0.50) {  # close in upper half of range is accumulation
            BarCountDataPos = 1;
            BarCountDataNeg = 0;
        } else {  # close in lower half of range is stalling
            BarCountDataPos = 0;
            BarCountDataNeg = -1;
        }
    } else if (PriceChange < 0)  {   # negative close
        if (CloseRelativeToPriceRange < 0.38) {  # close in lower 38% of range is distribution
            BarCountDataPos = 0;
            BarCountDataNeg = -1;
        } else {  # support day, down but in upper 62% of bar
            BarCountDataPos = 1;
            BarCountDataNeg = 0;
        }
    } else {
            BarCountDataPos = 0;
            BarCountDataNeg = 0;
    }
} else {
    PriceChange = 0;
    PriceHigh = 0;
    PriceLow = 0;
    PriceRange = 0;
    CloseRelativeToPriceRange = 0;

    BarCountDataPos = 0;
    BarCountDataNeg = 0;
}

# Plot the tick marks showing individual instances of accumulation or distribution
plot BarCountPlot = (BarCountDataPos + BarCountDataNeg) * 100;
BarCountPlot.setPaintingStrategy(PaintingStrategy.HISTOGRAM);
def LineColor = if(BarCountDataPos > 0.0, 16, if(BarCountDataNeg < 0.0, 5, 17));
BarCountPlot.AssignValueColor(getColor(LineColor));
BarCountPlot.HideTitle();

# Plot of the sum of net a/d instances since the beginning of the chart
plot BarSumPlot = TotalSum(BarCountDataPos + BarCountDataNeg);
BarSumPlot.SetDefaultColor(Color.YELLOW);
BarSumPlot.setLineWeight(2);

# Plot of the reference line showing a net of zero a/d periods.
plot ZeroLine = 0;
ZeroLine.SetDefaultColor(Color.WHITE);
ZeroLine.HideTitle();

# Plot of the sum of positive a/d instances since the beginning of the chart
plot BarSumPlotPos = TotalSum(BarCountDataPos);
BarSumPlotPos.SetDefaultColor(Color.CYAN);
BarSumPlotPos.setLineWeight(2);

# Plot of the sum of negative a/d instances since the beginning of the chart
plot BarSumPlotNeg = TotalSum(BarCountDataNeg);
BarSumPlotNeg.SetDefaultColor(Color.MAGENTA);
BarSumPlotNeg.setLineWeight(2);

# Plot of the sum of total a/d instances since the beginning of the chart
plot BarSumPlotAbs = TotalSum(BarCountDataPos - BarCountDataNeg);
BarSumPlotAbs.SetDefaultColor(Color.LIGHT_ORANGE);
BarSumPlotAbs.setLineWeight(2);
