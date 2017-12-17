#
# Copyright 2014 Scott J. Johnson (http://scottjjohnson.com)
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
# AccumulationDistributionBarCountMS
#
# Counts the instances of accumulation and distribution in a stock over a 
# period of time.  Based on Mike Scott's presentation at the IBD National Meetup
# in May 2014.
# http://ibdtv.investors.com/national-meetup-events/699580-.aspx
#
# The parameters in this study match Mike's presentation. I've created a customized
# version named AccumulationDistributionBarCount.
#
# This study is designed to be applied with the aggregation period of days or weeks.
#
declare lower;

input AvgVolumePeriod = 50;

# 50 day average volume
def AvgVolume = Average(volume, AvgVolumePeriod);

# accumulation/distribution count
def BarCountData;
def PriceChange;
def PriceRange;
def CloseRelativeToPriceRange;

if (volume > AvgVolume) {
    PriceChange = close - close[1];
    PriceRange = high - low;
    CloseRelativeToPriceRange = (close - low) / PriceRange;

    if (PriceChange > 0) {  # positive close
        if (CloseRelativeToPriceRange >= 0.50) {  # close in upper half of range is accumulation
            BarCountData = 1;
        } else {  # close in lower half of range is stalling
            BarCountData = -1;
        }
    } else if (PriceChange < 0)  {   # negative close
        if (CloseRelativeToPriceRange < 0.40) {  # close in lower 40% of range is distribution
            BarCountData = -1;
        } else {
            BarCountData = 1;   # support day, down but in upper 60% of bar
        }
    } else {
        BarCountData = 0;
    }
} else {
    PriceChange = 0;
    PriceRange = 0;
    CloseRelativeToPriceRange = 0;

    BarCountData = 0;
}

# Plot the tick marks showing individual instances of accumulation or distribution
plot BarCountPlot = BarCountData * 100;
BarCountPlot.setPaintingStrategy(PaintingStrategy.HISTOGRAM);
def LineColor = if(BarCountData > 0.0, 16, if(BarCountData < 0.0, 5, 17));
BarCountPlot.AssignValueColor(getColor(LineColor));
BarCountPlot.HideTitle();

# Plot of the sum of a/d instances since the beginning of the chart
plot BarSumPlot = TotalSum(BarCountData);
BarSumPlot.SetDefaultColor(Color.YELLOW);
BarSumPlot.setLineWeight(2);

# Plot of the reference line showing a net of zero a/d periods.
plot ZeroLine = 0;
ZeroLine.SetDefaultColor(Color.WHITE);
